import { Request, Response, NextFunction } from 'express'
import { Sharp } from 'sharp'

function viewCache(viewRequests: Map<string, Sharp>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { url } = req
        if (viewRequests.has(url)) viewRequests.get(url).pipe(res)
        else next()
    }
}

export default viewCache