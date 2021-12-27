import express, { Request, Response, Router } from 'express'
import path from "path"
import config from '../config'
import sharp, { Sharp } from 'sharp'

const router: Router = express.Router()

router.get('/:trans_list/:file_name', async (req: Request, res: Response) => {
    const filePath = path.join(config.uploadDirPath, req.params.file_name)
    const trans_list = req.params.trans_list
    const transArray = trans_list.split(';')

    const firstInvalidTrans = findInvalidTrans(transArray)

    if (firstInvalidTrans) {
        res.send(`bad command: ${firstInvalidTrans}`)
        return
    }

    const trans: string = transArray[0]

    if (/rotate\.*/.test(trans)) {
        const angle: number = parseInt(trans.match(/-?\d+/)[0])
        try {
            await sharp(filePath)
                .rotate(angle)
                .resize(100, 200, {
                    fit: 'fill'
                })
                .pipe(res)
        } catch (error) {
            res.status(500).send(error)
        }
    } else {
        const [, height, width] = trans.match(/height=(\d+),width=(\d+)/)
        try {
            await sharp(filePath)
                .resize(parseInt(height), parseInt(width), {
                    fit: 'fill'
                })
                .pipe(res)
        } catch (error) {
            res.status(500).send(error)
        }
    }
})

// function execute(command: string): Sharp {

// }

function findInvalidTrans(transArray: string[]): string {
    return transArray.find(curTrans => {
        const pattern: RegExp = /^(rotate:angle=-?\d+|resize:height=\d+,width=\d+)$/
        return !pattern.test(curTrans)
    })
}

export default router