import config from './config/config'
import express, { Request, Response, Express } from 'express'
import fileUpload from "express-fileupload"
import pingRouter from './routes/ping'
import uploadRouter from './routes/upload'
import viewRouter from './routes/view'
import loginRouter from './routes/login'
import devRouter from './routes/dev'
import mongoose, { ObjectId } from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import resolvers from './graphql/resolvers'
import typeDefs from './graphql/typeDefs'
import auth from "./middlewares/authToken"
import expressJwt from 'express-jwt'

async function connectToMongoDB(): Promise<boolean> {
  try {
    await mongoose.connect(config.dbUrl)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

async function initApolloServer(app: Express): Promise<void> {
  const apolloServer: ApolloServer = new ApolloServer({
    typeDefs, resolvers, context: ({ req }) => {
      const userId: ObjectId | undefined = req.user ? req.user.userId : undefined
      return { userId }
    }
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({ app })
}

function initMiddlewares(app: Express): void {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(fileUpload())
  app.use(expressJwt({
    secret: config.accessTokenSecret,
    algorithms: ["HS256"],
    credentialsRequired: false
  }))
}

function initRoutes(app: Express): void {
  app.get('/', (req: Request, res: Response) => {
    res.send('hi')
  })
  app.use('/dev', devRouter)
  app.use('/login', loginRouter)
  app.use('/ping', pingRouter)
  app.use('/upload', auth, uploadRouter)
  app.use('/view', auth, viewRouter)
}

async function initApp(app: Express) {
  if (!(await connectToMongoDB()))
    return

  initMiddlewares(app)
  initRoutes(app)
  initApolloServer(app)
}

const app = express()

initApp(app)

export default app