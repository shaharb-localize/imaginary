import { UserModel, User } from "../models/User";
import { ImageModel, Image } from "../models/Image";
import { DocumentType } from '@typegoose/typegoose'

export async function getAllImages(): Promise<DocumentType<Image>[]> {
    return await ImageModel.find().populate('owner')
}

export async function getImageByName(imageName: string): Promise<DocumentType<Image>> {
    return await ImageModel.findOne({ name: imageName })
}

export async function deleteImageByName(imageName: string) {
    await ImageModel.deleteOne({ name: imageName })
}

export async function getUserByName(userName: string): Promise<DocumentType<User>> {
    return await UserModel.findOne({ userName })
}

export async function getUserByPhone(phone: string): Promise<DocumentType<User>> {
    return await UserModel.findOne({ phone })
}

export async function createUser(name: string, phone: string, hashedPassword: string): Promise<DocumentType<User>> {
    return await UserModel.create({ name, phone, password: hashedPassword })
}