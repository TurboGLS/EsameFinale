import { AssegnazioneModel } from "../assegnazione/assegnazione.model";
import { Corso } from "../corso/corso.entity";
import { Categoria } from "../categoria/categoria.entity";

export type StatisticheFilters = {
    mese?: string;
    categoria?: string;
    dipendente?: string;
};

export type RigaStatistica = {
    mese: string;
    categoria: string;
    numeroAssegnazioni: number;
    numeroCompletamenti: number;
    percentualeCompletamento: number;
};

export class StatisticheService {

    // riepilogo dei corsi assegnati e completati aggregati per mese e categoria
    async academy(filters: StatisticheFilters): Promise<RigaStatistica[]> {
        // faccio che le assegnazioni annullate sono escluse dal conteggio
        const query: Record<string, any> = { stato: { $ne: 'Annullato' } };
        if (filters.dipendente) {
            query.dipendente = filters.dipendente;
        }

        // recupero le assegnazioni con corso e categoria popolati
        const assegnazioni = await AssegnazioneModel.find(query)
            .populate({ path: 'corso', populate: { path: 'categoria' } });

        // raggruppo in memoria per chiave "mese|categoria"
        const gruppi = new Map<string, RigaStatistica>();

        for (const doc of assegnazioni) {
            const a = doc.toObject();
            const corso = a.corso as Corso;
            const categoria = corso?.categoria as Categoria;
            const nomeCategoria = categoria?.nomeCategoria;
            const mese = new Date(a.dataAssegnazione).toISOString().slice(0, 7);

            // applico i filtri per categoria (per id, come nel resto dell'app) e per mese
            if (filters.categoria && categoria?.id !== filters.categoria) {
                continue;
            }
            if (filters.mese && mese !== filters.mese) {
                continue;
            }

            const chiave = `${mese}|${nomeCategoria}`;
            if (!gruppi.has(chiave)) {
                gruppi.set(chiave, {
                    mese,
                    categoria: nomeCategoria,
                    numeroAssegnazioni: 0,
                    numeroCompletamenti: 0,
                    percentualeCompletamento: 0,
                });
            }

            const riga = gruppi.get(chiave)!;
            riga.numeroAssegnazioni++;
            if (a.stato === 'Completato') {
                riga.numeroCompletamenti++;
            }
        }

        // ora calcolo la percentuale di completamento e ordino per mese e categoria
        return Array.from(gruppi.values())
            .map(riga => ({
                ...riga,
                percentualeCompletamento: riga.numeroAssegnazioni === 0
                    ? 0
                    : Math.round((riga.numeroCompletamenti / riga.numeroAssegnazioni) * 100 * 100) / 100,
            }))
            .sort((a, b) => a.mese.localeCompare(b.mese) || a.categoria.localeCompare(b.categoria));
    }
}

export default new StatisticheService();
