import { Schema, model } from 'mongoose';
import { RUOLI, User } from './user.entity';

const userSchema = new Schema<User>({
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    ruolo: { type: String, enum: RUOLI, default: 'DIPENDENTE', required: true },
    picture: String
})

userSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

userSchema.set('toObject', {
    virtuals: true,
    transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

export const UserModel = model<User>('User', userSchema);
