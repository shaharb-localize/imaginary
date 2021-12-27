import { Transformer } from "../transformer";
import { Sharp } from "sharp";
class Rotate implements Transformer {
    isOwnCommand(command: string): boolean {
        const pattern: RegExp = /^rotate:angle=-?\d+$/
        return pattern.test(command)
    }

    createExecuter(command: string): (image: Sharp) => Sharp {
        const angle: number = parseInt(command.match(/-?\d+/)[0])
        return (image: Sharp) => image.rotate(angle)
    }
}

const rotater = new Rotate()
export default rotater