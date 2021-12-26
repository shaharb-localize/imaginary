import express, { Request, Response, Router } from 'express'
import config from '../config'
import fs from 'fs';

const router: Router = express.Router()

router.get('/', async (req: Request, res: Response) => {
    try {
        const files: string[] = await fs.promises.readdir(config.uploadDirPath)
        res.send(files.length === 0 ? 'uploads dir empty' : files.join(', '))
    } catch (error) {
        res.status(500).send('something went wrong')
    }
})

export default router