import { Sharp } from 'sharp'
import rotater from './transformers/rotate'
import resizer from './transformers/resize'

export type executer = (image: Sharp) => Sharp

export interface Transformer {
    createExecuter(params: { [index: string]: string }): executer
    isParamStringValid(paramString: string): boolean
}

const transformersMap = new Map<string, Transformer>()
transformersMap.set('rotate', rotater)
transformersMap.set('resize', resizer)

export function validateCommand(commandString: string): string {
    const [commandName, paramsString] = commandString.split(':')

    if (transformersMap.has(commandName))
        return transformersMap.get(commandName).isParamStringValid(paramsString) ?
            '' : `params invalid in: ${commandString}`

    return `unknown command: ${commandName}`
}

export function getExecuter(command: string): executer {
    const [name, paramsString] = command.split(':');

    const transformer: Transformer = transformersMap.get(name);

    if (!transformer) throw `no transformer for ${command}`

    return transformer.createExecuter(getParamsObject(paramsString))
}

function getParamsObject(paramsString: string): { [index: string]: string } {
    return paramsString.split(',').reduce((params, curParam) => {
        const [key, val] = curParam.split('=')
        params[key] = val
        return params
    }, {})
}