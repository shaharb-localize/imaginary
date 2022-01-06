import { ObjectId } from "mongoose"
import { Response, NextFunction, Request } from 'express'

export default async function authenticateToken(
    req: Request, res: Response, next: NextFunction) {

    if (req.user.userId) {
        next()
        return
    }

    res.status(401).send('unauthorized')
}

export interface JwtPayload {
    exp?: number | undefined
    iat?: number | undefined
    userId: ObjectId
}

declare global {
    namespace Express {
        // interface Request {
        //     userId: ObjectId
        // }

        interface User {
            userId: ObjectId
        }
    }
}