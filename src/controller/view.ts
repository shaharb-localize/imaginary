import { Request, Response } from 'express'
import fs from 'fs'
import path from "path"
import config from '../config'
import sharp, { Sharp } from 'sharp'
import { validateCommand, getExecuter, executer } from '../transformations/transformer'
import { Image, ImageModel } from '../models/Image'

export function view() {
    const interval: number = parseInt(process.env.CACHE_INTERVAL)
    const viewRequests: Map<string, Sharp> = new Map()
    setInterval(() => viewRequests.clear(), interval * 1000)

    return async (req: Request, res: Response) => {
        const fileName = req.params.file_name
        const { url } = req

        if (viewRequests.has(url)) {
            await pipeImageAndUpdateAccessEntries(fileName, viewRequests.get(url), res)
            // viewRequests.get(url).pipe(res)
            return
        }

        respondToUncachedRequest(req, res, viewRequests)
    }
}

async function pipeImageAndUpdateAccessEntries(fileName: string, imageFile: Sharp, res: Response) {
    imageFile.pipe(res)
    await updateImageAccessEntries(fileName, imageFile)
}

async function updateImageAccessEntries(fileName: string, imageFile: Sharp) {
    const image: Image = await ImageModel.findOne({ name: fileName })
    image.accessEntries.push(new Date())
    const updated = await ImageModel.findByIdAndUpdate(image._id, image)
}

async function respondToUncachedRequest(req: Request, res: Response,
    viewRequests: Map<string, Sharp>) {
    const fileName = req.params.file_name,
        filePath = path.join(config.uploadDirPath, fileName)

    // check if request image exist
    try {
        if (!fs.existsSync(filePath)) {
            res.status(404).send('image not found')
            return
        }
    } catch (err) {
        res.status(500).send('something went wrong')
        return
    }

    const commands: string[] = req.params.trans_list.split(';')

    // check commands validation
    const errors: string[] =
        commands.map(curCommand =>
            validateCommand(curCommand)).filter(curError => curError != '')

    if (errors.length > 0) {
        res.status(400).send(errors.join(',\n'))
        return
    }

    // execute commands
    try {
        const finalImage: Sharp = executeCommands(commands, sharp(filePath))
        viewRequests.set(req.url, finalImage)
        finalImage.pipe(res)

        await pipeImageAndUpdateAccessEntries(fileName, finalImage, res)
    } catch (error) {
        res.status(500).send(error)
    }
}

function executeCommands(commands: string[], rawImage: Sharp): Sharp {
    const executersList: executer[] =
        commands.map(curCommand => getExecuter(curCommand))

    return executersList.reduce((finalResult, curExecuter) =>
        curExecuter(finalResult), rawImage)
}