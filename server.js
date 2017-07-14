var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');


var schema = buildSchema(`
  type User {
    id: String
    name: String
    predictions: [Team]
    email: String
    telephone: String
  }

  type Team {
    id: String
    name: String
  }

  type Query {
    user(id: String): User,
    team(id: String): Team
  }
`);


const teams = [
  { id:1, name:'Manchester United' },
  { id:2, name:'Liverpool' },
  { id:3, name:'Everton' },
  { id:4, name:'Chelsea' }
]; 

// Maps id to User object
const users = [ 
  { id: 'a', name: 'Andrew Stoddart', predictions: [1, 2], email: 'andy_stoddart@hotmail.com', telephone: '0876471817' },
  { id: 'b', name: 'Garry McMahon' }
];

var root = {
  user: function ({id}) {
    return users.find(function(user) {
      if (user.id === id) {
        user.predictions = user.predictions.map(prediction => {
          console.log(prediction);
          return teams.find(team => team.id === prediction)
          
        })
        return user;
      }
    })
  },
  team: function ({id}) {
    return teams.find(team => team.id = id);
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