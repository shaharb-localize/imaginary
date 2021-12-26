import express, { Request, Response, Router } from 'express'
import path from "path"
import config from '../config'

const router: Router = express.Router()

router.get('/:file_name', (req: Request, res: Response) => {
    const filePath = path.join(config.uploadDirPath, req.params.file_name)
    res.download(filePath);
})

export default router