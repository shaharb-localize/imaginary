import fs from 'fs'
import { Request, Response } from 'express'
import path from "path"
import config from '../config'
import sharp, { Sharp } from 'sharp'

export async function viewNotSolidFunc(req: Request, res: Response) {
    // check if file exist
    const filePath = path.join(config.uploadDirPath, req.params.file_name)

    try {
        if (!fs.existsSync(filePath)) {
            res.status(404).send('image not found')
            return
        }
    } catch (err) {
        res.status(500).send('something went wrong')
        return
    }

    // check if trans series valid
    const transArray = req.params.trans_list.split(';')

    const firstInvalidTrans = findInvalidTrans(transArray)

    if (firstInvalidTrans) {
        res.send(`bad command: ${firstInvalidTrans}`)
        return
    }

    // execute transformations
    try {
        const endImage = await executeSeriesTrans(filePath, transArray)
        endImage.pipe(res)
    } catch (error) {
        res.status(500).send(error)
    }
}

async function executeSeriesTrans(filePath: string, transArray: string[]): Promise<Sharp> {
    let image: Sharp = sharp(filePath)

    for (const curCommand of transArray) {
        image = await executeSingleTrans(curCommand, image)
    }

    return image
}

async function executeSingleTrans(command: string, subject: Sharp): Promise<Sharp> {
    if (/rotate\.*/.test(command)) {
        const angle: number = parseInt(command.match(/-?\d+/)[0])
        return subject.rotate(angle)
    } else {
        const [, height, width] = command.match(/height=(\d+),width=(\d+)/)
        return subject.resize(parseInt(height), parseInt(width), {
            fit: 'fill'
        })
    }
}

function findInvalidTrans(transArray: string[]): string {
    return transArray.find(curTrans => {
        const pattern: RegExp = /^(rotate:angle=-?\d+|resize:height=\d+,width=\d+)$/
        return !pattern.test(curTrans)
    })
}