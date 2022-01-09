import { DocumentNode } from 'graphql'
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

    type LoginResult {
      didLogin: Boolean!
      token: String
      details: String
    }

    union ImageResult = Image | ShaharError
    union UserResult = User | ShaharError

    input UserInput {
      name: String!
      phone: String!
      password: String!
    }
    
    type Query {
      getAllUsers: [User!]!
      getUser(name: String!): UserResult
      getAllImages: [ImageResult!]!
      test: String
    }

    type Mutation {
        login(name: String!, password: String!): LoginResult
        register(user: UserInput!): UserResult
        deleteImage(name: String!): String
    }
`;

export default typeDefs