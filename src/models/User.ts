import { getModelForClass, prop } from '@typegoose/typegoose'

export class User {
    @prop()
    public name: string;
    @prop()
    public phone: string;
    @prop()
    public password: string;
}

export const UserModel = getModelForClass(User);