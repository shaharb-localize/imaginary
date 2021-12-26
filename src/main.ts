import config from './config'
import express, { Express } from 'express'
import fileUpload from "express-fileupload"
import pingRouter from './routes/ping'
import uploadRouter from './routes/upload'
import viewRouter from './routes/view'
import lsRouter from './routes/ls'

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use('/ping', pingRouter)
app.use('/upload', uploadRouter)
app.use('/view', viewRouter)
app.use('/ls', lsRouter)

app.listen(config.port, () => {
  console.log(`listening at http://localhost:${config.port}`)
});