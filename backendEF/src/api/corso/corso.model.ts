import { Schema, model } from 'mongoose';
import { Corso } from './corso.entity';

const corsoSchema = new Schema<Corso>({
    titolo: { type: String, required: true },
    descrizione: { type: String, default: '' },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    durataOre: { type: Number, required: true, min: 1 },
    obbligatorio: { type: Boolean, default: false },
    attivo: { type: Boolean, default: true }
})

corsoSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

corsoSchema.set('toObject', {
    virtuals: true,
    transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});


export const CorsoModel = model<Corso>('Corso', corsoSchema);
