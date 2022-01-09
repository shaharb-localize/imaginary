import { GraphQLScalarType, Kind } from 'graphql'

export class LoginResult {
    public didLogin: boolean
    public token: string
    public details: string

    constructor(didLogin: boolean, details: string, token: string = '') {
        this.didLogin = didLogin
        this.details = details
        this.token = token
    }
}

export class ImageDeletionResult {
    public wasDeleted: boolean
    public errorDetails: string

    constructor(wasDeleted: boolean, errorDetails: string = '') {
        this.wasDeleted = wasDeleted
        this.errorDetails = errorDetails
    }
}

export class ShaharError {
    public msg: string

    constructor(msg: string) {
        this.msg = msg
    }
}

export const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        return value.getTime()
    },
    parseValue(value) {
        return new Date(value)
    },
    parseLiteral(ast) {
        return ast.kind === Kind.INT ? new Date(parseInt(ast.value, 10)) : null
    }
})