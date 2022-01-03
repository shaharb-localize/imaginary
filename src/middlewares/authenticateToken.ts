import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config'

export interface JwtPayload {
    exp?: number | undefined;
    iat?: number | undefined;
    name: string
}

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload
        }
    }
}

export default function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader: string = req.headers['authorization']

    if (!authHeader) {
        res.status(401).send('unauthorized')
        return
    }

    const token: string = authHeader.split(' ')[1]

    if (!token) {
        res.status(401).send('unauthorized')
        return
    }

    jwt.verify(token, config.accessTokenSecret, (error, user: JwtPayload) => {
        if (error) {
            res.status(403).send('invalid token')
            return
        }

        req.user = user

        next()
    })
}