const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Book {
        authors: [String]
        description: String!
        bookId: String!
        image: String,
        # link: String,
        title: String!
    }

    type User {
        _id: ID
        username: String!
        email: String
        password: String!
        savedBooks: [Book]
    }

    type Auth {
        token: ID!
        user: User!
    }

    input BookInput { #same as Type Book above
        authors: [String]
        bookId: String!
        description: String!
        image: String,
        # link: String,
        title: String!
    }

    type Query {
        users: [User]
        user (userId: ID!): User 
        me: User
    }

    type Mutation {
        login (email: String!, password: String!): Auth
        createUser (username: String!, email: String!, password: String!): Auth
        delete_book (bookId: String!): User
        save_book (bookInput: BookInput!): User
    }
`;

module.exports = typeDefs;