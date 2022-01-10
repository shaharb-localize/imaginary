import { ShaharError, ImagesSelectionResult } from './results'
import { DocumentType } from '@typegoose/typegoose'
import { User } from '../models/User'
import * as db from '../db/db'

export async function getAllImages(userId: string): Promise<ImagesSelectionResult> {
    if (!userId) return ImagesSelectionResult.getUnauthorizedResult()

    try {
        return ImagesSelectionResult.createSuccessfulResult(await db.getAllImages())
    } catch (error) {
        console.error(error)
        return ImagesSelectionResult.createFailedResult(error.msg)
    }
}

export async function getUser(name: string): Promise<DocumentType<User> | ShaharError> {
    try {
        const userResult: DocumentType<User> = await db.getUserByName(name)
        return userResult ? userResult : new ShaharError('unknown user')
    } catch (error) {
        console.error(error)
        return new ShaharError('server error')
    }
}