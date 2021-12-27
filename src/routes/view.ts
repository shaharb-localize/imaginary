import fs from 'fs'
import express, { Request, Response, Router } from 'express'
import path from "path"
import config from '../config'
import sharp, { Sharp } from 'sharp'
import { isCommandValid, getExecuter, executer } from '../transformations/transformer'

const router: Router = express.Router()

// router.get('/:trans_list/:file_name', viewNotSolidFunc)
router.get('/:trans_list/:file_name', viewSolidFunc)

async function viewSolidFunc(req: Request, res: Response) {
    const filePath = path.join(config.uploadDirPath, req.params.file_name)

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
    const invalidCommand: string | undefined = findInvalidCommand(commands)

    if (invalidCommand) {
        res.status(400).send(`bad command: ${invalidCommand}`)
        return
    }

    // execute commands
    try {
        const finalImage = await executeCommands(commands, sharp(filePath))
        finalImage.pipe(res)
    } catch (error) {
        res.status(500).send(error)
    }
}

async function executeCommands(commands: string[], rawImage: Sharp): Promise<Sharp> {
    const arr: executer[] = commands.map(curCommand => getExecuter(curCommand))
    let image: Sharp = rawImage

    for (const curExecuter of arr)
        image = await curExecuter(image)

    return image
}

function findInvalidCommand(commands: string[]): string | undefined {
    return commands.find(curCommand => !isCommandValid(curCommand))
}

export default router