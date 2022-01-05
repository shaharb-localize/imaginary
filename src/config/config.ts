import dotenv from 'dotenv';
dotenv.config()

import path from "path"
import config from './config.json'

export type Config = {
    uploadDirPath: string,
    port: string,
    extname_pattern: RegExp,
    dbUrl: string,
    accessTokenSecret: string
}

const { DB_USER: dbUser,
    DB_PASSWORD: dbPassword,
    DB_HOST_NAME: dbHost,
    DB_HOST_PORT: dbPort,
    PORT: port,
    ACCESSS_TOKEN_SECRET: accessTokenSecret } = process.env

const str: string = config.allowedFormats.map(curExt => `\\.${curExt}`).join('|')
const extname_pattern: RegExp = new RegExp(`^(${str})$`)
const uploadDirPath: string = path.join(__dirname, '..', '..', process.env.UPLOAD_DIR_NAME)
const dbUrl: string =
    `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/imaginary?authSource=admin`

const exportedConfig: Config =
    { uploadDirPath, port, extname_pattern, dbUrl, accessTokenSecret }
export default exportedConfig