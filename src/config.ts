import path from "path"
import dotenv from 'dotenv';
dotenv.config()

const port: string | undefined = process.env.PORT
const exts: string[] = ['jpg', 'jpeg', 'png']
const str: string = exts.map(curExt => `\\.${curExt}`).join('|')
const pattern: RegExp = new RegExp(`^(${str})$`)

const config = {
    uploadDirPath: path.join(__dirname, '..', process.env.UPLOAD_DIR_NAME),
    port: port ? parseInt(port) : 5001,
    extname_pattern: pattern
}

export default config