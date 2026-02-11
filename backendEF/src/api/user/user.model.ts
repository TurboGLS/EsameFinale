import { Schema, model } from 'mongoose';
import { User } from './user.entity';

const userSchema = new Schema<User>({
    firstName: String,
    lastName: String,
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