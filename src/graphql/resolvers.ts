import { UserModel } from '../models/User'
import { IResolvers } from '@graphql-tools/utils'
import { dateScalar } from './scalars'
import { getAllImages, getUser } from './queries'
import { login, deleteImage, register } from './mutations'

const resolvers: IResolvers = {
    Date: dateScalar,
    UserResult: {
        __resolveType(obj: any) {
            if (obj.phone) return 'User'
            else if (obj.msg) return 'ShaharError'
            else return null // GraphQLError is thrown
        },
    },
    Query: {
        getAllUsers: async () => await UserModel.find(),
        getUser: async (_parent, { name }) => await getUser(name),
        getAllImages: async (_parent, _args, { userId }) => await getAllImages(userId),
        test: async () => 'hi'
    },
    Mutation: {
        login: async (_parent, { name, password }) => await login(name, password),
        deleteImage: async (_parent, { name: imageName }, { userId }) => await deleteImage(imageName, userId),
        register: async (_parent, { user }) => {
            const { name, phone, password } = user
            return await register(name, phone, password)
        }
    }
}

export default resolvers