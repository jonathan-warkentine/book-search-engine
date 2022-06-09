import { gql } from '@apollo/client';

export const LOGIN_USER = gql `
    mutation LOGIN ($email: String!, $password: String!) {
        login (email: $email, password: $password) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`

export const SIGNUP_USER = gql `
    mutation SIGNUP_USER ($email: String!, $username: String!, $password: String!) {
        createUser (username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`

export const DELETE_BOOK = gql `
    mutation DELETE_BOOK ($bookId: String!) {
        delete_book (bookId: $bookId) {
            _id
        }
    }
`

export const SAVE_BOOK = gql `
    mutation SAVE_BOOK ($bookInput: BookInput!) {
        save_book (bookInput: $bookInput) {
            username
            email
            password
            savedBooks {
                title
            }
        }
    }
`