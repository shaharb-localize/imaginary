import express, { Request, Response, Router } from 'express'
import User from '../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config'

const router: Router = express.Router()

router.post('/', async (req: Request, res: Response) => {
    const { name, password } = req.body
    const user = await User.findOne({ name: name })

    if (!user) {
        res.status(400).send('unknown user')
        return
    }

    try {
        if (await bcrypt.compare(password, user.password)) {
            const accessToken: string =
                jwt.sign({ name: user.name }, config.accessTokenSecret, { expiresIn: '2h' })
            res.status(200).json({ accessToken })
            return
        }

        res.send('bad')
    } catch (error) {
        console.error(error)
        res.status(500).send('something went wrong')
    }
})

export default router