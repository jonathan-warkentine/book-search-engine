import React, { useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useLazyQuery, useMutation } from '@apollo/client';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { QUERY_ME } from '../utils/graphql/queries';
import { DELETE_BOOK } from '../utils/graphql/mutations';

const SavedBooks = () => {

  const [ queryMe, { called, loading, error, data } ] = useLazyQuery(QUERY_ME);
  const [ deleteBook, { delBkEr, delBkData} ] = useMutation(DELETE_BOOK);
  
  useEffect(() => {
    queryMe();
  }, []);
  
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    try {
      // TODO: assign resulting user object to userData?
       deleteBook({
        variables: {
          bookId
        }
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
      // also update the page:
      queryMe();
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
            {data.me.savedBooks.map((book) => {
              return (
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
              );
            })}
          </CardColumns>
        </Container>
      </>
    );
  }
  
  return <h2>LOADING...</h2>;

};

export default SavedBooks;