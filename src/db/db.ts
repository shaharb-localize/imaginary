import { UserModel, User } from "../models/User";
import { ImageModel, Image } from "../models/Image";
import { DocumentType } from '@typegoose/typegoose'
import { ObjectId } from 'mongoose'

export async function getAllImages(): Promise<DocumentType<Image>[]> {
    return await ImageModel.find().populate('owner')
}

export async function getImageByName(imageName: string): Promise<DocumentType<Image>> {
    return await ImageModel.findOne({ name: imageName })
}

export async function deleteImageByName(imageName: string) {
    await ImageModel.deleteOne({ name: imageName })
}

export async function deleteAllImages() {
    await ImageModel.deleteMany()
}

export async function deleteAllUsers() {
    await UserModel.deleteMany()
}

export async function createImage(fileName: string, ownerId: ObjectId): Promise<DocumentType<Image>> {
    return await ImageModel.create({ name: fileName, owner: ownerId })
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