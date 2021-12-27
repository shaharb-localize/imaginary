import { Transformer } from "../transformer";
import { Sharp } from "sharp";
class Resize implements Transformer {
    isOwnCommand(command: string): boolean {
        const pattern: RegExp = /^resize:height=\d+,width=\d+$/
        return pattern.test(command)
    }

    createExecuter(command: string): (image: Sharp) => Sharp {
        const [, height, width] = command.match(/height=(\d+),width=(\d+)/)
        return (image: Sharp) => image.resize(parseInt(height), parseInt(width), {
            fit: 'fill'
        })
    }
}

const resizer = new Resize()
export default resizer