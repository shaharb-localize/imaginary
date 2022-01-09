import { getModelForClass, prop } from '@typegoose/typegoose'

export class User {
    @prop({ unique: true, required: true })
    public name: string;

    @prop({ unique: true, required: true })
    public phone: string;

    @prop({ required: true })
    public password: string;
}

export const UserModel = getModelForClass(User);