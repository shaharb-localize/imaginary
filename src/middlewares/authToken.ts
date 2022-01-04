import { Response, NextFunction, Request } from 'express'
import { UserModel } from '../models/User'
import { ObjectId } from "mongoose"
import { extractUserId } from '../controller/authToken'

export default async function authenticateToken(
    req: Request, res: Response, next: NextFunction) {
    const userId: ObjectId | undefined = extractUserId(req)

    if (userId) {
        try {
            req.user = await UserModel.findById(userId)
            next()
            return
        } catch (error) {
            console.error(error)
        }
    }

    res.status(401).send('unauthorized')
}