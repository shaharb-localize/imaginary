import { UserModel } from '../models/User'
import { IResolvers } from '@graphql-tools/utils'
import bcrypt from 'bcrypt'
import { ImageModel } from 'models/Image';
import { dateScalar } from './typeDefs'
import { ApolloError } from 'apollo-server-express'
// import fs from 'fs'
// import path from 'path'
// import config from '../config/config';

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
        getUser: async (parent, { name }, context, info) => {
            return await UserModel.findOne({ name: name });
        },
        getAllImages: async (parent, args, { userId }, info) => {
            try {
                if (!userId) {
                    return 'unauthorized'
                }

                return await ImageModel.find().populate('owner')
            } catch (error) {
                throw new ApolloError(error)
            }
        },
        test: async (parent, args, { userId }, info) => {
            return 'hi'
        }
    },
    Mutation: {
        login: async (parent, args, context, info) => {
        },
        register: async (parent, args, context, info) => {
            const { name, phone, password } = args.user

            if (!(name && phone && password)) {
                throw new Error("all inputs required")
            }

            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password, salt)

            return await UserModel.create({ name, phone, password: hashedPassword })
        }
        // ,
        // deleteImage: async (parent, args, { userId }, info) => {
        //     if (!userId) {
        //         console.log('AAA')
        //         return 'unauthorized'
        //     }

        //     const imageName: string = args.name
        //     const image: Image = await ImageModel.findOne({ name: imageName })

        //     if (image.owner !== userId) {
        //         console.log('BBB')
        //         return 'unauthorized'
        //     }

        //     try {
        //         const imageFileFullPath: string = path.join(config.uploadDirPath, imageName)
        //         await fs.promises.unlink(imageFileFullPath)
        //         await ImageModel.deleteOne({ name: imageName })
        //         return `image ${imageName} was deleted`
        //     } catch (error) {
        //         return error.msg
        //     }
        // }
    }
}

export default resolvers