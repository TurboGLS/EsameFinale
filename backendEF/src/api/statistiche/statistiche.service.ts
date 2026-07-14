import mongoose, { PipelineStage } from "mongoose";
import { AssegnazioneModel } from "../assegnazione/assegnazione.model";

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
        const pipeline: PipelineStage[] = [];

        // metto che assegnazioni annullate sono escluse dal conteggio
        const initialMatch: Record<string, any> = { stato: { $ne: 'Annullato' } };
        if (filters.dipendente) {
            initialMatch.dipendente = new mongoose.Types.ObjectId(filters.dipendente);
        }
        pipeline.push({ $match: initialMatch });

        // join con corso e con la relativa categoria con query di mongo
        pipeline.push(
            { $lookup: { from: 'corsos', localField: 'corso', foreignField: '_id', as: 'corso' } },
            { $unwind: '$corso' },
            { $lookup: { from: 'categorias', localField: 'corso.categoria', foreignField: '_id', as: 'categoria' } },
            { $unwind: '$categoria' }
        );

        // inserisco il filtro per nome categoria
        if (filters.categoria) {
            pipeline.push({ $match: { 'categoria.nomeCategoria': filters.categoria } });
        }

        // ricavo il mese dalla data di assegnazione
        pipeline.push({
            $addFields: {
                mese: { $dateToString: { format: '%Y-%m', date: '$dataAssegnazione' } }
            }
        });

        // filtro per mese o periodo
        if (filters.mese) {
            pipeline.push({ $match: { mese: filters.mese } });
        }

        // raggruppo per mese, categoria e conto assegnazioni e completamenti
        pipeline.push({
            $group: {
                _id: { mese: '$mese', categoria: '$categoria.nomeCategoria' },
                numeroAssegnazioni: { $sum: 1 },
                numeroCompletamenti: {
                    $sum: { $cond: [{ $eq: ['$stato', 'Completato'] }, 1, 0] }
                }
            }
        });

        pipeline.push({
            $project: {
                _id: 0,
                mese: '$_id.mese',
                categoria: '$_id.categoria',
                numeroAssegnazioni: 1,
                numeroCompletamenti: 1,
                percentualeCompletamento: {
                    $cond: [
                        { $eq: ['$numeroAssegnazioni', 0] },
                        0,
                        { $round: [{ $multiply: [{ $divide: ['$numeroCompletamenti', '$numeroAssegnazioni'] }, 100] }, 2] }
                    ]
                }
            }
        });

        pipeline.push({ $sort: { mese: 1, categoria: 1 } });

        return AssegnazioneModel.aggregate<RigaStatistica>(pipeline);
    }
}

export default new StatisticheService();
