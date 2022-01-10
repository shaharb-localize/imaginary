import { UserModel, User } from "../models/User";
import { ImageModel, Image } from "../models/Image";
import { DocumentType } from '@typegoose/typegoose'

export async function getAllImages(): Promise<DocumentType<Image>[]> {
    return await ImageModel.find().populate('owner')
}

export async function getUserByName(userName: string): Promise<DocumentType<User>> {
    return await UserModel.findOne({ userName })
}