import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';

import Auth from '../utils/auth';
import { QUERY_ME } from '../utils/graphql/queries';
import { DELETE_BOOK } from '../utils/graphql/mutations';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  
  // fetch-only to force re-rendering in case of added/deleted books
  const { loading, error, data, refetch } = useQuery(QUERY_ME, { fetchPolicy: 'network-only' }); 
  const [ deleteBook ] = useMutation(DELETE_BOOK);  

  const handleDeleteBook = async bookId => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    try {
      await deleteBook({
        variables: {
          bookId
        }
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
      // also update the page:
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return (<div>
      <h2>ERROR ACCESSING YOUR ACCOUNT...</h2>;
      <p>{JSON.stringify(error)}</p>
    </div>)
  }

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  if (data) {
    return (
      <>
        <Jumbotron fluid className='text-light bg-dark'>
          <Container>
            <h1>Viewing saved books!</h1>
          </Container>
        </Jumbotron>
        <Container>
          <h2>
            {data.me.savedBooks.length
              ? `Viewing ${data.me.savedBooks.length} saved ${data.me.savedBooks.length === 1 ? 'book' : 'books'}:`
              : 'You have no saved books!'}
          </h2>
          <CardColumns>
            {data.me.savedBooks.map( book => 
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
             )}
          </CardColumns>
        </Container>
      </>
    );
  }

};

export default SavedBooks;