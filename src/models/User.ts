import { getModelForClass, prop } from '@typegoose/typegoose'
import { ObjectId } from "bson"

export class User {
    @prop()
    public _id: ObjectId;
    @prop()
    public name: string;
    @prop()
    public phone: string;
    @prop()
    public password: string;
}

export const UserModel = getModelForClass(User);