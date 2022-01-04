import express, { Router } from 'express'
import { view } from '../controller/view'

const router: Router = express.Router()
// const interval: number = parseInt(process.env.CACHE_INTERVAL)
// const viewRequests: Map<string, Sharp> = new Map()
// setInterval(() => viewRequests.clear(), interval * 1000)

router.get('/:trans_list/:file_name', view())

export default router