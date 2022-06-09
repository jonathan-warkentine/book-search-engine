const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require("apollo-server-express");

const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// require('dotenv').config()
// if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') { //
  app.use(express.static(path.join(__dirname, '../client/build')));
// }

// converting to GraphQL queries
// app.use(routes);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  introspection: true
});

server.start()
  .then( () => {
    server.applyMiddleware({ app }); 
    db.once('open', () => {
      app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
    });
  })

