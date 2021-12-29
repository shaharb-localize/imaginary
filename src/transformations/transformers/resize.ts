import { Transformer, executer } from "../transformer";
import { Sharp } from "sharp";
class Resize implements Transformer {
    createExecuter(params: { [index: string]: string }): executer {
        const { height, width } = params
        return (image: Sharp) => image.resize(parseInt(height), parseInt(width), {
            fit: 'fill'
        })
    }

    isParamStringValid(paramString: string): boolean {
        return /height=\d+,width=\d+/.test(paramString)
    }
}

const resizer = new Resize()
export default resizer