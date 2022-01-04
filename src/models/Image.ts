import { getModelForClass, prop } from '@typegoose/typegoose'
import { ObjectId } from "bson"

export class Image {
    @prop({ auto: true })
    public _id: ObjectId;
    @prop()
    public name: string;
    @prop()
    public owner: ObjectId;
    @prop()
    public accessEntries: Date[];
}

export const ImageModel = getModelForClass(Image);