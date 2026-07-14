import { Schema, model } from 'mongoose';
import { Categoria } from './categoria.entity';

const categoriaSchema = new Schema<Categoria>({
    nomeCategoria: { type: String, required: true },
})

categoriaSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

categoriaSchema.set('toObject', {
    virtuals: true,
    transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});


export const CategoriaModel = model<Categoria>('Categoria', categoriaSchema);