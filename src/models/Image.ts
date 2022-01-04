import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { ObjectId } from "mongoose"
import { User } from '../models/User'

export class Image {
    @prop({ auto: true })
    public _id: ObjectId;

    @prop()
    public name: string;

    @prop({ ref: () => User })
    public owner: Ref<User>;

    @prop()
    public accessEntries: Date[];
}

export const ImageModel = getModelForClass(Image);