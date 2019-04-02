const { ApolloServer, gql } = require('apollo-server');

const todos = [
  { task: 'Wash car', completed: false },
  { task: 'Clean room', completed: true }
];

const typeDefs = gql`
  type Query {
    task: String
    completed: Boolean
  }
`;

const server = new ApolloServer({
  typeDefs
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
