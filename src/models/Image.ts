import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { User } from '../models/User'
import { DocumentType } from '@typegoose/typegoose'

export class Image {
    @prop()
    public name: string

    @prop({ ref: () => User })
    public owner: Ref<DocumentType<User>>

    @prop()
    public accessEntries: Date[]
}

export const ImageModel = getModelForClass(Image)