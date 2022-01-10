import { Request, Response } from 'express'
import { FileArray, UploadedFile } from "express-fileupload"
import path from "path"
import config from '../config/config'
import * as db from '../db/db'

export async function processUploadingRequest(req: Request, res: Response) {
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded.');
        return
    }

    const uploadFiles: UploadedFile[] = extractAllFiles(req.files)

    const invalidFile = uploadFiles.find(curFile => !isValidFile(curFile))
    if (invalidFile) {
        res.status(400).send(`file ${invalidFile.name} is invalid`)
        return
    }

    const values: boolean[] =
        await Promise.all(uploadFiles.map(curFile => uploadFile(curFile)))

    if (values.some(curVal => !curVal)) {
        res.send('not all files were uploaded')
    } else {
        await Promise.all(uploadFiles.map(curFile =>
            db.createImage(curFile.name, req.user.userId)
        ))

        res.send('all files were uploaded')
    }
}

function extractAllFiles(files: FileArray): UploadedFile[] {
    const uploadFiles: UploadedFile[] = []

    Object.values(files).forEach(curEntry => {
        if (isUploadedFile(curEntry)) uploadFiles.push(curEntry)
        else uploadFiles.push(...curEntry)
    });

    return uploadFiles
}

async function uploadFile(file: UploadedFile): Promise<boolean> {
    const uploadPath: string = path.join(config.uploadDirPath, file.name)

    try {
        await file.mv(uploadPath);
        return true
    }
    catch (error) {
        return false;
    }
}

function isValidFile(file: UploadedFile): boolean {
    return config.extname_pattern.test(path.extname(file.name))
}

function isUploadedFile(entry: UploadedFile | UploadedFile[]): entry is UploadedFile {
    return (entry as UploadedFile).name !== undefined;
}