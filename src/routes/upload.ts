import express, { Router } from 'express'
import { processUploadingRequest } from '../controller/upload'

const router: Router = express.Router()

router.put('/', processUploadingRequest)

export default router