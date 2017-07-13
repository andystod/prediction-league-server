var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');


var schema = buildSchema(`
  type User {
    id: String
    name: String
    predictions: [Team]
  }

  type Team {
    id: String
    name: String
  }

  type Query {
    user(id: String): User
  }
`);

// Maps id to User object
const users = [ 
  { id: 'a', name: 'Andrew Stoddart', predictions: ['Manchester United', 'Liverpool', 'Everton', 'Chelsea'] },
  { id: 'b', name: 'Garry McMahon' }
];

const teams = [
  { id:1, name:'Manchester United' },
  { id:2, name:'Liverpool' },
  { id:3, name:'Everton' },
  { id:4, name:'Chelsea' }
]; 

var root = {
  user: function ({id}) {
    return users.find(user => user.id = id);
  }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');