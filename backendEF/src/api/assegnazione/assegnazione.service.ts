import { Assegnazione, StatoAssegnazione } from "./assegnazione.entity";
import { AssegnazioneModel } from "./assegnazione.model";
import { CorsoModel } from "../corso/corso.model";
import { UserModel } from "../user/user.model";
import { NotFoundError } from "../../errors/not-found.error";

export class AssegnazioneValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AssegnazioneValidationError';
    }
}

export class TransizioneNonValidaError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TransizioneNonValida';
    }
}

// utente autenticato che effettua l'operazione
export type CurrentUser = { id?: string; ruolo: 'DIPENDENTE' | 'REFERENTE' };

export type AssegnazioneFilters = {
    stato?: StatoAssegnazione;
    categoria?: string;
    corso?: string;
    dipendente?: string;
};

export class AssegnazioneService {

    // Calcola lo stato di un'assegnazione per impostare assegnato o scaduto
    private statoEffettivo(a: Assegnazione): StatoAssegnazione {
        if (a.stato === 'Assegnato' && a.dataScadenza && new Date(a.dataScadenza).getTime() < Date.now()) {
            return 'Scaduto';
        }
        return a.stato;
    }

    private toDto(doc: any): Assegnazione {
        const obj = doc.toObject();
        obj.stato = this.statoEffettivo(obj);
        return obj;
    }

    async all(filters: AssegnazioneFilters, currentUser: CurrentUser): Promise<Assegnazione[]> {
        const query: Record<string, any> = {};

        // un dipendente può vedere solo le assegnazioni intestate a lui
        if (currentUser.ruolo === 'DIPENDENTE') {
            query.dipendente = currentUser.id;
        } else if (filters.dipendente) {
            query.dipendente = filters.dipendente;
        }

        // filtro per corso e/o categoria
        if (filters.categoria) {
            const corsi = await CorsoModel.find({ categoria: filters.categoria }).select('_id');
            const idsCategoria = corsi.map(c => String(c._id));
            if (filters.corso) {
                // il corso specifico deve anche appartenere alla categoria selezionata
                query.corso = idsCategoria.includes(filters.corso) ? filters.corso : { $in: [] };
            } else {
                query.corso = { $in: idsCategoria };
            }
        } else if (filters.corso) {
            query.corso = filters.corso;
        }

        const docs = await AssegnazioneModel.find(query)
            .populate({ path: 'corso', populate: { path: 'categoria' } })
            .populate('dipendente')
            .sort({ dataScadenza: 1 });

        let result = docs.map(d => this.toDto(d));

        // il filtro per stato è applicato sullo stato calcolato sopra
        if (filters.stato) {
            result = result.filter(a => a.stato === filters.stato);
        }
        return result;
    }

    async getById(id: string, currentUser: CurrentUser): Promise<Assegnazione> {
        const doc = await AssegnazioneModel.findById(id)
            .populate({ path: 'corso', populate: { path: 'categoria' } })
            .populate('dipendente');
        if (!doc) {
            throw new NotFoundError();
        }
        this.assertOwnership(doc, currentUser);
        return this.toDto(doc);
    }

    async add(data: { corso: string; dipendente: string; dataAssegnazione?: string; dataScadenza: string }): Promise<Assegnazione> {
        // il corso deve esistere ed essere attivo
        const corso = await CorsoModel.findById(data.corso);
        if (!corso) {
            throw new AssegnazioneValidationError('Corso non trovato');
        }
        if (!corso.attivo) {
            throw new AssegnazioneValidationError('Un corso non attivo non può essere usato per nuove assegnazioni');
        }

        // il dipendente deve esistere ed avere il ruolo corretto, quindi dipendente
        const dipendente = await UserModel.findById(data.dipendente);
        if (!dipendente || dipendente.ruolo !== 'DIPENDENTE') {
            throw new AssegnazioneValidationError('Dipendente non valido');
        }

        const dataAssegnazione = data.dataAssegnazione ? new Date(data.dataAssegnazione) : new Date();
        const dataScadenza = new Date(data.dataScadenza);
        // la data di scadenza non può essere precedente alla data di assegnazione
        if (dataScadenza.getTime() < dataAssegnazione.getTime()) {
            throw new AssegnazioneValidationError('La data di scadenza non può essere precedente alla data di assegnazione');
        }

        const creata = await AssegnazioneModel.create({
            corso: data.corso,
            dipendente: data.dipendente,
            dataAssegnazione,
            dataScadenza,
            stato: 'Assegnato'
        });
        return this.getById(creata.id, { ruolo: 'REFERENTE' });
    }

    async update(id: string, data: { corso?: string; dipendente?: string; dataScadenza?: string }): Promise<Assegnazione> {
        const doc = await AssegnazioneModel.findById(id);
        if (!doc) {
            throw new NotFoundError();
        }

        if (data.corso) {
            const corso = await CorsoModel.findById(data.corso);
            if (!corso) {
                throw new AssegnazioneValidationError('Corso non trovato');
            }
            doc.corso = data.corso as any;
        }
        if (data.dipendente) {
            const dipendente = await UserModel.findById(data.dipendente);
            if (!dipendente || dipendente.ruolo !== 'DIPENDENTE') {
                throw new AssegnazioneValidationError('Dipendente non valido');
            }
            doc.dipendente = data.dipendente as any;
        }
        if (data.dataScadenza) {
            const dataScadenza = new Date(data.dataScadenza);
            if (dataScadenza.getTime() < new Date(doc.dataAssegnazione).getTime()) {
                throw new AssegnazioneValidationError('La data di scadenza non può essere precedente alla data di assegnazione');
            }
            doc.dataScadenza = dataScadenza;
        }

        await doc.save();
        return this.getById(doc.id, { ruolo: 'REFERENTE' });
    }

    // solo il dipendente proprietario o il referente può completare e solo se è ancora attiva
    async completa(id: string, currentUser: CurrentUser): Promise<Assegnazione> {
        const doc = await AssegnazioneModel.findById(id);
        if (!doc) {
            throw new NotFoundError();
        }
        this.assertOwnership(doc, currentUser);

        if (doc.stato === 'Completato') {
            throw new TransizioneNonValidaError('Assegnazione già completata');
        }
        if (doc.stato === 'Annullato') {
            throw new TransizioneNonValidaError('Impossibile completare un\'assegnazione annullata');
        }

        doc.stato = 'Completato';
        doc.dataCompletamento = new Date();
        await doc.save();
        return this.getById(doc.id, currentUser);
    }

    // annullamento solo per il referente
    async annulla(id: string): Promise<Assegnazione> {
        const doc = await AssegnazioneModel.findById(id);
        if (!doc) {
            throw new NotFoundError();
        }
        if (doc.stato === 'Completato') {
            throw new TransizioneNonValidaError('Impossibile annullare un\'assegnazione completata');
        }
        doc.stato = 'Annullato';
        await doc.save();
        return this.getById(doc.id, { ruolo: 'REFERENTE' });
    }

    async remove(id: string): Promise<void> {
        const doc = await AssegnazioneModel.findById(id);
        if (!doc) {
            throw new NotFoundError();
        }
        await doc.deleteOne();
    }

    // impedisco a un dipendente di accedere alle assegnazioni di altri.
    private assertOwnership(doc: any, currentUser: CurrentUser): void {
        if (currentUser.ruolo === 'REFERENTE') {
            return;
        }
        const dipendenteId = doc.dipendente?._id ? String(doc.dipendente._id) : String(doc.dipendente);
        if (dipendenteId !== String(currentUser.id)) {
            throw new NotFoundError();
        }
    }
}

export default new AssegnazioneService();
