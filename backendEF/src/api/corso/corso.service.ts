import { Corso } from "./corso.entity";
import { CorsoModel } from "./corso.model";
import { AssegnazioneModel } from "../assegnazione/assegnazione.model";
import { NotFoundError } from "../../errors/not-found.error";

export class CorsoHasAssegnazioniError extends Error {
    constructor() {
        super();
        this.name = 'CorsoHasAssegnazioni';
        this.message = 'Impossibile eliminare un corso con assegnazioni collegate';
    }
}

export type CorsoFilters = {
    categoria?: string;
    attivo?: boolean;
};

export class CorsoService {

    async all(filters: CorsoFilters = {}): Promise<Corso[]> {
        const query: Record<string, any> = {};
        if (filters.categoria) {
            query.categoria = filters.categoria;
        }
        if (typeof filters.attivo === 'boolean') {
            query.attivo = filters.attivo;
        }
        const corsi = await CorsoModel.find(query).populate('categoria').sort({ titolo: 1 });
        return corsi.map(c => c.toObject());
    }

    async getById(id: string): Promise<Corso> {
        const corso = await CorsoModel.findById(id).populate('categoria');
        if (!corso) {
            throw new NotFoundError();
        }
        return corso.toObject();
    }

    async add(corso: Corso): Promise<Corso> {
        const nuovo = await CorsoModel.create(corso);
        return (await nuovo.populate('categoria')).toObject();
    }

    async update(id: string, corso: Partial<Corso>): Promise<Corso> {
        const aggiornato = await CorsoModel.findByIdAndUpdate(id, corso, { new: true, runValidators: true })
            .populate('categoria');
        if (!aggiornato) {
            throw new NotFoundError();
        }
        return aggiornato.toObject();
    }

    // disattivo il corso
    async disattiva(id: string): Promise<Corso> {
        return this.update(id, { attivo: false });
    }

    async remove(id: string): Promise<void> {
        const corso = await CorsoModel.findById(id);
        if (!corso) {
            throw new NotFoundError();
        }
        // un corso non può essere eliminato se ha assegnazioni collegate
        const assegnazioniCollegate = await AssegnazioneModel.exists({ corso: id });
        if (assegnazioniCollegate) {
            throw new CorsoHasAssegnazioniError();
        }
        await corso.deleteOne();
    }
}

export default new CorsoService();
