import { Request, Response } from 'express'
import fs from 'fs'
import path from "path"
import config from '../config'
import sharp, { Sharp } from 'sharp'
import { validateCommand, getExecuter, executer } from '../transformations/transformer'

export async function view(req: Request, res: Response) {
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
    // const errors: string[] =
    //     commands.filter(curCommand => validateCommand(curCommand))
    const errors: string[] =
        commands.map(curCommand => validateCommand(curCommand)).filter(curError => curError != '')

    if (errors.length > 0) {

        res.status(400).send(errors.join(',\n'))
        return
    }
    // const invalidCommand: string | undefined = findInvalidCommand(commands)

    // if (invalidCommand) {
    //     res.status(400).send(`unknown command: ${invalidCommand}`)
    //     return
    // }

    // execute commands
    try {
        const finalImage = await executeCommands(commands, sharp(filePath))
        finalImage.pipe(res)
    } catch (error) {
        res.status(500).send(error)
    }
}

async function executeCommands(commands: string[], rawImage: Sharp): Promise<Sharp> {
    const executersList: executer[] = commands.map(curCommand => getExecuter(curCommand))

    return executersList.reduce((finalResult, curExecuter) => curExecuter(finalResult), rawImage)
}

function findInvalidCommand(commands: string[]): string | undefined {
    return commands.find(curCommand => validateCommand(curCommand))
}














