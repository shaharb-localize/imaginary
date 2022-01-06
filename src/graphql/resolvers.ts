import { UserModel, User } from '../models/User'
import { ImageModel, Image } from 'models/Image';
import { IResolvers } from '@graphql-tools/utils'
import bcrypt from 'bcrypt'
import { dateScalar } from './typeDefs'
import { ApolloError } from 'apollo-server-express'
import fs from 'fs'
import path from 'path'
import config from '../config/config';
import jwt from 'jsonwebtoken'
import { DocumentType } from '@typegoose/typegoose'

const resolvers: IResolvers = {
    Date: dateScalar,
    StamUnion: {
        __resolveType(obj: any) {
            if (obj.name) return 'Image'
            else if (obj.msg) return 'ShaharError'
            return null // GraphQLError is thrown
        },
    },
    Query: {
        getAllUsers: async () => await UserModel.find(),
        getUser: async (parent, { name }) => {
            return await UserModel.findOne({ name: name });
        },
        getAllImages: async (parent, args, { userId }) => {
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
        login: async (parent, { name, password }) => {
            try {
                const user: DocumentType<User> = await UserModel.findOne({ name })

                if (!user) return 'unknown user'

                return await bcrypt.compare(password, user.password) ?
                    jwt.sign({ userId: user._id },
                        config.accessTokenSecret,
                        { expiresIn: '2h', algorithm: "HS256" }) :
                    'wrong password'

            } catch (error) {
                console.error(error)
                return 'server error'
            }
        },
        register: async (parent, args, context, info) => {
            const { name, phone, password } = args.user

            if (!(name && phone && password)) throw new Error("all inputs required")

            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password, salt)

            try {
                const user: User = await UserModel.create({ name, phone, password: hashedPassword })
                console.log('created user', user)
                return user
            } catch (error) {
                console.error(error);
                throw error
            }
        },
        deleteImage: async (parent, args, { userId }, info) => {
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

export default resolvers