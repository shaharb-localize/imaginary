import { DocumentNode } from 'graphql'
import { gql } from 'apollo-server-express'

const typeDefs: DocumentNode = gql`
    scalar Date

    type ImageDeletionResult {
      wasDeleted: Boolean!
      errorDetails: String
    }

    type ShaharError {
      msg: String!
    }

    type User {
      name: String!
      phone: String!
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

    type ImagesSelectionResult {
      didSucceed: Boolean!
      images: [Image!]
      error: String
    }

    union UserResult = User | ShaharError

    input UserInput {
      name: String!
      phone: String!
      password: String!
    }
    
    type Query {
      getAllUsers: [User!]!
      getUser(name: String!): UserResult!
      getAllImages: ImagesSelectionResult!
      test: String
    }

    type Mutation {
        login(name: String!, password: String!): LoginResult
        register(user: UserInput!): UserResult
        deleteImage(name: String!): ImageDeletionResult
    }
`;

export default typeDefs