import express, { Router } from 'express'
import { processLoginRequest } from '../controller/login'

const router: Router = express.Router()

router.post('/', processLoginRequest)

export default router