import express, { Request, Response, Router } from 'express'
import User from '../models/User'
import config from '../config'
import fs from 'fs';

const router: Router = express.Router()

router
    .delete('/deleteAllUsers', async (req: Request, res: Response) => {
        await User.deleteMany()
        res.send('deleted')
    })
    .get('/ls', async (req: Request, res: Response) => {
        try {
            const files: string[] = await fs.promises.readdir(config.uploadDirPath)
            res.send(files.length === 0 ? 'uploads dir empty' : files.join(', '))
        } catch (error) {
            res.status(500).send('something went wrong')
        }
    })

export default router