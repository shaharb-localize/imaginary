import { Image } from '../models/Image';
import { DocumentType } from '@typegoose/typegoose'

export class ImagesSelectionResult {
    public didSucceed: boolean
    public images: DocumentType<Image>[]
    public error: string

    constructor(didSucceed: boolean, images: DocumentType<Image>[] = [], error: string = '') {
        this.didSucceed = didSucceed
        this.images = images
        this.error = error
    }

    static createSuccessfulResult(images: DocumentType<Image>[]): ImagesSelectionResult {
        return new ImagesSelectionResult(true, images)
    }

    static createFailedResult(error: string): ImagesSelectionResult {
        return new ImagesSelectionResult(false, [], error)
    }
}

export class LoginResult {
    public didLogin: boolean
    public token: string
    public details: string

    constructor(didLogin: boolean, details: string, token: string = '') {
        this.didLogin = didLogin
        this.details = details
        this.token = token
    }
}

export class ImageDeletionResult {
    public wasDeleted: boolean
    public errorDetails: string

    constructor(wasDeleted: boolean, errorDetails: string = '') {
        this.wasDeleted = wasDeleted
        this.errorDetails = errorDetails
    }
}

export class ShaharError {
    public msg: string

    constructor(msg: string) {
        this.msg = msg
    }
}
