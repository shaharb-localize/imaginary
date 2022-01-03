import config from './config'
import express, { Request, Response, Express } from 'express'
import fileUpload from "express-fileupload"
import pingRouter from './routes/ping'
import uploadRouter from './routes/upload'
import viewRouter from './routes/view'
import loginRouter from './routes/login'
import devRouter from './routes/dev'
import mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import resolvers from './resolvers'
import typeDefs from './typeDefs'
import auth from "./middlewares/authenticateToken"

async function main() {
  try {
    await mongoose.connect(config.dbUrl)
  } catch (error) {
    console.error(error)
    return
  }

  const app: Express = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(fileUpload())

  app.get('/', (req: Request, res: Response) => {
    res.send('hi')
  })

  app.use('/dev', devRouter)
  app.use('/login', loginRouter)
  app.use('/ping', pingRouter)
  app.use('/upload', auth, uploadRouter)
  app.use('/view', auth, viewRouter)

  const server: ApolloServer = new ApolloServer({ typeDefs, resolvers })
  await server.start()
  server.applyMiddleware({ app })

  app.listen(config.port, () => {
    console.log(`listening at http://localhost:${config.port}`)
  })
}

main()