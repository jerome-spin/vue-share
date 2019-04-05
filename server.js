const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

require('dotenv').config();
const User = require('./models/User');
const Post = require('./models/Post');

mongoose
  .connect(process.env.MONGO_URI, { 
    useCreateIndex:true,
    useNewUrlParser: true
  })
  .then(() => console.log('DB connected'))
  .catch(err => console.error(err));

const typeDefs = gql`
  type Todo {
    task: String
    completed: Boolean
  }

  type Query {
    getTodos: [Todo]
  }
`;

const server = new ApolloServer({
  typeDefs,
  context: {
    User,
    Post
  }
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
