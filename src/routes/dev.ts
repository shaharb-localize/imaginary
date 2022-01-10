import express, { Request, Response, Router } from 'express'
import config from '../config/config'
import fs from 'fs';
import path from 'path';
import * as db from '../db/db'

const router: Router = express.Router()

router
    .delete('/deleteAllUsers', async (req: Request, res: Response) => {
        await db.deleteAllUsers()
        res.send('all users were deleted')
    })
    .delete('/deleteAllImages', async (req: Request, res: Response) => {
        clearDir(config.uploadDirPath)
        await db.deleteAllImages()
        res.send('all images were deleted')
    })
    .get('/ls', async (req: Request, res: Response) => {
        try {
            const files: string[] = await fs.promises.readdir(config.uploadDirPath)
            res.send(files.length === 0 ? 'uploads dir empty' : files.join(', '))
        } catch (error) {
            res.status(500).send('something went wrong')
        }
    })

function clearDir(dirPath: string) {
    fs.readdir(dirPath, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(dirPath, file), err => {
                if (err) throw err;
            });
        }
    });
}

export default router