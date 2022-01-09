import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { User } from '../models/User'
import { DocumentType } from '@typegoose/typegoose'

export class Image {
    @prop({ unique: true, required: true })
    public name: string

    @prop({ required: true, ref: () => User })
    public owner: Ref<DocumentType<User>>

    @prop({ default: [] })
    public accessEntries: Date[]
}

export const ImageModel = getModelForClass(Image)