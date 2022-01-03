import User from './models/User'
import { IResolvers } from '@graphql-tools/utils'
import bcrypt from 'bcrypt'

const resolvers: IResolvers = {
    Query: {
        getAllUsers: async () => await User.find(),
        getUser: async (parent, { name }, context, info) => {
            return await User.findOne({ name: name });
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

            return await User.create({ name, phone, password: hashedPassword })
        }
    }
};

export default resolvers