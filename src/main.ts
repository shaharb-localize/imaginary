require('dotenv').config()
import express, { Express, Request, Response } from 'express'
import fileUpload, { UploadedFile, FileArray } from "express-fileupload"
import path from "path"
// const express = require('express');
const app: Express = express();
const port: number = parseInt(process.env.PORT) || 5001
const uploadDirPath = __dirname + '/../uploads/'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.get('/ping', (req: Request, res: Response) => {
  res.send('pong')
})

app.post('/upload', (req: Request, res: Response) => {
  
  const files: FileArray = req.files

  // console.log(Array.isArray(files))
  // console.log(Object.keys(files))

  // for (const curFile in files) {
  //   console.log(files[curFile].name)
  // }
  
  // res.send('OK')
  
  const file: UploadedFile = req.files.f1 as UploadedFile;

  const uploadPath: string = uploadDirPath + file.name

  console.log(uploadPath)

  file.mv(uploadPath, error => {
    if (error) res.status(500).send(error)
    else res.send('file uploaded!')
  })
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
});

// (async () => {
//   console.log('Starting!')
// })();
