import { DocumentNode, GraphQLScalarType, Kind } from 'graphql'
import { gql } from 'apollo-server-express'

const typeDefs: DocumentNode = gql`
    scalar Date

    type ShaharError {
      msg: String!
    }

    type User {
      id: String!
      name: String!
      phone: String!
      password: String!
    }

    type Image {
      name: String!
      owner: User!
      accessEntries: [Date!]!
    }

    union StamUnion = Image | ShaharError

    input UserInput {
      name: String!
      phone: String!
      password: String!
    }
    
    type Query {
      getAllUsers: [User!]!
      getUser(name: String!): User
      getAllImages: [Image!]!
      test: String
    }

    type Mutation {
        login(name: String!, password: String!): String
        register(user: UserInput!): User
    }
`;
// deleteImage(name: String!): String

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

export default typeDefs