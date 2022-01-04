import { UserModel } from './models/User'
import { IResolvers } from '@graphql-tools/utils'
import bcrypt from 'bcrypt'

const resolvers: IResolvers = {
    Query: {
        getAllUsers: async () => await UserModel.find(),
        getUser: async (parent, { name }, context, info) => {
            return await UserModel.findOne({ name: name });
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
    }
};

export default resolvers