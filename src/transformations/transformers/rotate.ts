import { Transformer } from "../transformer";
import { Sharp } from "sharp";
class Rotate implements Transformer {
    createExecuter(params: { [index: string]: string }): (image: Sharp) => Sharp {
        return (image: Sharp) => image.rotate(parseInt(params.angle))
    }

    isParamStringValid(paramString: string): boolean {
        return /angle=-?\d+/.test(paramString)
    }
}

const rotater = new Rotate()
export default rotater