import jwt from 'jsonwebtoken'
import config from '../config/config'
import { ObjectId } from "mongoose"
import { User } from '../models/User'
import { Request } from 'express'

export interface JwtPayload {
    exp?: number | undefined
    iat?: number | undefined
    userId: ObjectId
}

declare global {
    namespace Express {
        interface Request {
            user: User
        }
    }
}

export function extractUserId(req: Request): ObjectId | undefined {
    const authHeader: string = req.headers['authorization']
    if (!authHeader) return undefined

    const token: string = authHeader.split(' ')[1]
    if (!token) return undefined

    try {
        const verificationResult: JwtPayload | undefined = verifyToken(token)
        return verificationResult ? (verificationResult as JwtPayload).userId : undefined
    } catch (error) {
        console.error(error)
        return undefined
    }
}

function verifyToken(token: string): JwtPayload | undefined {
    const tokenPayload = jwt.verify(token, config.accessTokenSecret)
    return instanceOfJwtPayload(tokenPayload) ? tokenPayload as JwtPayload : undefined
}

function instanceOfJwtPayload(object: any): object is JwtPayload {
    return 'userId' in object;
}