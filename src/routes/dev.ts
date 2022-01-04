import express, { Request, Response, Router } from 'express'
import { UserModel } from '../models/User'
import { ImageModel } from '../models/Image'
import config from '../config/config'
import fs from 'fs';

const router: Router = express.Router()

router
    .delete('/deleteAllUsers', async (req: Request, res: Response) => {
        await UserModel.deleteMany()
        res.send('all users were deleted')
    })
    .delete('/deleteAllImages', async (req: Request, res: Response) => {
        await ImageModel.deleteMany()
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

export default router