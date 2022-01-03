import { DocumentNode } from 'graphql'
import { gql } from 'apollo-server-express'

const typeDefs: DocumentNode = gql`
    type User {
      name: String!
      phone: String!
      password: String!
    }

    type Query {
      getAllUsers: [User!]!
      getUser(name: String!): User
    }

    input UserInput {
      name: String!
      phone: String!
      password: String!
    }

    type Mutation {
        login(name: String!, password: String!): String
        register(user: UserInput!): User
    }
`;

export default typeDefs