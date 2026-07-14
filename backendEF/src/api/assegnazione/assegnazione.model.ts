import { Schema, model } from 'mongoose';
import { Assegnazione, STATI_ASSEGNAZIONE } from './assegnazione.entity';

const assegnazioneSchema = new Schema<Assegnazione>({
    corso: { type: Schema.Types.ObjectId, ref: 'Corso', required: true },
    dipendente: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dataAssegnazione: { type: Date, required: true, default: Date.now },
    dataScadenza: { type: Date, required: true },
    stato: { type: String, enum: STATI_ASSEGNAZIONE, default: 'Assegnato', required: true },
    dataCompletamento: { type: Date }
})

assegnazioneSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

assegnazioneSchema.set('toObject', {
    virtuals: true,
    transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export const AssegnazioneModel = model<Assegnazione>('Assegnazione', assegnazioneSchema);
