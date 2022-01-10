import { UserModel, User } from '../models/User'
import bcrypt from 'bcrypt'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import config from '../config/config';
import { ImageModel, Image } from '../models/Image';
import { DocumentType } from '@typegoose/typegoose'
import { ShaharError, LoginResult, ImageDeletionResult } from './results'

export async function login(name: string, password: string): Promise<LoginResult> {
    try {
        const user: DocumentType<User> = await UserModel.findOne({ name })

        if (!user) return new LoginResult(false, "unknown user")

        if (await bcrypt.compare(password, user.password)) {
            const token: string = jwt.sign({ userId: user._id },
                config.accessTokenSecret,
                { expiresIn: '2h', algorithm: "HS256" })

            return new LoginResult(true, '', token)
        }
        else return new LoginResult(false, 'wrong password')
    } catch (error) {
        console.error(error)
        return new LoginResult(false, 'server error')
    }
}

export async function register(name: string, phone: string, password: string): Promise<ShaharError | DocumentType<User>> {
    if (await UserModel.findOne({ name }))
        return new ShaharError('user name already exist')

    if (await UserModel.findOne({ phone }))
        return new ShaharError('user phone already exist')

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt())

    try {
        return await UserModel.create({ name, phone, password: hashedPassword })
    } catch (error) {
        console.error(error);
        return new ShaharError('server error')
    }
}

export async function deleteImage(imageName: string, userId: string): Promise<ImageDeletionResult> {
    if (!userId) return new ImageDeletionResult(false, 'unauthorized')

    const image: Image = await ImageModel.findOne({ name: imageName })

    if (!image)
        return new ImageDeletionResult(false, 'unknown image')

    if (image.owner._id.toString() !== userId)
        return new ImageDeletionResult(false, 'unauthorized')
    try {
        const imageFileFullPath: string = path.join(config.uploadDirPath, imageName)
        await fs.promises.unlink(imageFileFullPath)
        await ImageModel.deleteOne({ name: imageName })
        return new ImageDeletionResult(true)
    } catch (error) {
        console.error(error)
        return new ImageDeletionResult(false, error.msg)
    }
}