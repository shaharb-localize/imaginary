import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { ObjectId } from "bson"

class Image {
    @prop()
    public name: string;
    @prop()
    public owner: ObjectId;
    // @prop()
    // public accessEntries: Date[];
}

export const ImageModel = getModelForClass(Image);