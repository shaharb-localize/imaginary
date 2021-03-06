import { Request, Response } from 'express'
import { UserModel, User } from '../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/config'
import { DocumentType } from '@typegoose/typegoose'

export async function processLoginRequest(req: Request, res: Response) {
    const { name, password } = req.body
    const user: DocumentType<User> = await UserModel.findOne({ name: name })

    if (!user) {
        res.status(400).send('unknown user')
        return
    }

    try {
        if (await bcrypt.compare(password, user.password)) {
            const accessToken: string =
                jwt.sign({ userId: user._id }, config.accessTokenSecret, { expiresIn: '2h' })
            res.status(200).json({ accessToken })
            return
        }

        res.send('bad')
    } catch (error) {
        console.error(error)
        res.status(500).send('something went wrong')
    }
}