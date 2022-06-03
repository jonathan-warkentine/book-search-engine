import { gql } from '@apollo/client';

export const QUERY_ME = gql `
    query QUERY_ME {
        me {
            _id
            email
            username
            savedBooks {
                title
                authors
                description
                bookId
                image
            }
        }
    }
` 

export const QUERY_USERS = gql `
    query QUERY_USERS {
        users {
            _id
        }
    }
`