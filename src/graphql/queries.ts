import { ImageModel } from '../models/Image';
import { ShaharError, ImagesSelectionResult } from './results'
import { DocumentType } from '@typegoose/typegoose'
import { UserModel, User } from '../models/User'

export async function getAllImages(userId: string): Promise<ImagesSelectionResult> {
    if (!userId) return ImagesSelectionResult.createFailedResult('unauthorized')

    try {
        return ImagesSelectionResult.createSuccessfulResult(await ImageModel.find().populate('owner'))
    } catch (error) {
        console.error(error)
        return ImagesSelectionResult.createFailedResult(error.msg)
    }
}

export async function getUser(name: string): Promise<DocumentType<User> | ShaharError> {
    try {
        const userResult: DocumentType<User> = await UserModel.findOne({ name })
        return userResult ? userResult : new ShaharError('unknown user')
    } catch (error) {
        console.error(error)
        return new ShaharError('server error')
    }
}