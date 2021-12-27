import express, { Router } from 'express'
import { view } from '../controller/view'

const router: Router = express.Router()

// router.get('/:trans_list/:file_name', viewNotSolidFunc)
router.get('/:trans_list/:file_name', view)

export default router