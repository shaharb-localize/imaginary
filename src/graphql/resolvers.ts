import bcrypt from 'bcrypt'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import config from '../config/config';
import { UserModel, User } from '../models/User'
import { ImageModel, Image } from '../models/Image';
import { IResolvers } from '@graphql-tools/utils'
import { ApolloError } from 'apollo-server-express'
import { DocumentType } from '@typegoose/typegoose'
import { GraphQLScalarType, Kind } from 'graphql'

class LoginResult {
    public didLogin: boolean
    public token: string
    public details: string

    constructor(didLogin: boolean, details: string, token: string = '') {
        this.didLogin = didLogin
        this.details = details
        this.token = token
    }
}

class ShaharError {
    public msg: string

    constructor(msg: string) {
        this.msg = msg
    }
}

const dateScalar = new GraphQLScalarType({
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

const resolvers: IResolvers = {
    Date: dateScalar,
    UserResult: {
        __resolveType(obj: any) {
            if (obj.phone) return 'User'
            else if (obj.msg) return 'ShaharError'
            return null // GraphQLError is thrown
        },
    },
    ImageResult: {
        __resolveType(obj: any) {
            if (obj.name) return 'Image'
            else if (obj.msg) return 'ShaharError'
            return null // GraphQLError is thrown
        },
    },
    Query: {
        getAllUsers: async () => await UserModel.find(),
        getUser: async (_parent, { name }) => {
            try {
                const userResult: DocumentType<User> = await UserModel.findOne({ name })
                return userResult ? userResult : new ShaharError('unknown user')
            } catch (error) {
                console.error(error)
                return new ShaharError('server error')
            }
        },
        getAllImages: async (_parent, _args, { userId }) => {
            try {
                if (!userId) return [{ msg: 'unauthorized' }]

                return await ImageModel.find().populate('owner')
            } catch (error) {
                throw new ApolloError(error)
            }
        },
        test: async () => {
            return 'hi'
        }
    },
    Mutation: {
        login: async (_parent, { name, password }) => {
            try {
                const user: DocumentType<User> = await UserModel.findOne({ name })

                if (!user) return new LoginResult(false, "unknown user")

                const compareResult: boolean = await bcrypt.compare(password, user.password)
                if (compareResult) {
                    const token: string = jwt.sign({ userId: user._id },
                        config.accessTokenSecret,
                        { expiresIn: '2h', algorithm: "HS256" })

                    return new LoginResult(true, '', token)
                }
                else return new LoginResult(false, 'wrong password')
            } catch (error) {
                console.error(error)
                return new LoginResult(false, 'server error')
            }
        },
        register: async (_parent, args) => {
            const { name, phone, password } = args.user

            if (await UserModel.findOne({ name })) return new ShaharError('user name already exist')
            if (await UserModel.findOne({ phone })) return new ShaharError('user phone already exist')

            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password, salt)

            try {
                return await UserModel.create({ name, phone, password: hashedPassword })
            } catch (error) {
                console.error(error);
                return new ShaharError('server error')
            }
        },
        deleteImage: async (_parent, args, { userId }) => {
            if (!userId) return 'unauthorized'

            const imageName: string = args.name
            const image: Image = await ImageModel.findOne({ name: imageName })

            if (!image) return 'unknown image'

            if (image.owner._id.toString() !== userId) return 'unauthorized'

            try {
                const imageFileFullPath: string = path.join(config.uploadDirPath, imageName)
                await fs.promises.unlink(imageFileFullPath)
                await ImageModel.deleteOne({ name: imageName })
                return `image ${imageName} was deleted`
            } catch (error) {
                return error.msg
            }
        }
    }
}

async function isUserNameExist(name: string): Promise<boolean> {
    return !!(await UserModel.findOne({ name }))
}

async function isUserPhoneExist(phone: string): Promise<boolean> {
    return !!(await UserModel.findOne({ phone }))
}

export default resolvers