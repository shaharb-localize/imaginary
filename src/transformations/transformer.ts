import { Sharp } from 'sharp'
import rotater from './transformers/rotate'
import resizer from './transformers/resize'

export type executer = (image: Sharp) => Sharp

export interface Transformer {
    isOwnCommand(command: string): boolean
    createExecuter(command: string): executer
}

const transformersArray: Transformer[] = [
    rotater,
    resizer
]

export function isCommandValid(command: string): boolean {
    return transformersArray.some(curTrans => curTrans.isOwnCommand(command))
}

export function getExecuter(command: string): executer {
    const transformer: Transformer = transformersArray.find(curTrans => curTrans.isOwnCommand(command))

    if (!transformer) {
        throw `no transformer for ${command}`
    }

    return transformer.createExecuter(command)
}