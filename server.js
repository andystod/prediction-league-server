var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var cors = require('cors')

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

  type TableRow {
    id: String,
    user: User,
    gameweekPick: Team,
    gameweekPoints: Int,
    totalPoints: Int,
    position: Int
  }

  type Query {
    user(id: String): User,
    team(id: String): Team,
    table: [TableRow]
  }
`);


const teams = [
  { id: 1, name: 'Manchester United' },
  { id: 2, name: 'Liverpool' },
  { id: 3, name: 'Everton' },
  { id: 4, name: 'Chelsea' }
];

console.log(teams[0]);
console.log([teams[0], teams[1]]);

// Maps id to User object
const users = [
  { id: 'a', name: 'Andrew Stoddart', predictions: [teams[0], teams[3]], email: 'andystod@hotmail.com', telephone: '08753543534' },
  { id: 'b', name: 'Garry McMahon', predictions: [teams[1], teams[2]], email: 'gmac@hotmail.com', telephone: '03123123123' },
  { id: 'b', name: 'Cormac Fagan', predictions: [teams[3], teams[0]], email: 'cormacfagan@hotmail.com', telephone: '031233333123' },
  { id: 'b', name: 'Enda McElhiney', predictions: [teams[3], teams[2]], email: 'endamac@hotmail.com', telephone: '03123122223' }
];

const tableRows = [
  { id: 'a', user: users[0], gameweekPick: teams[0], gameweekPoints: 3, totalPoints: 6, position: 1 },
  { id: 'b', user: users[1], gameweekPick: teams[2], gameweekPoints: 2, totalPoints: 5, position: 2 },
  { id: 'c', user: users[2], gameweekPick: teams[3], gameweekPoints: 0, totalPoints: 3, position: 3 },
  { id: 'd', user: users[3], gameweekPick: teams[3], gameweekPoints: 0, totalPoints: 3, position: 3 }];


var root = {
  user: function ({ id }) {
    return users.find(function (user) {
      if (user.id === id) {
        // user.predictions = user.predictions.map(prediction => {
        //   console.log(prediction);
        //   return teams.find(team => team.id === prediction)

        // })
        return user;
      }
    })
  },
  team: function ({ id }) {
    return teams.find(team => team.id = id);
  },
  table: function() {
    console.log('here1');
    console.log(tableRows);
    console.log(tableRows.length);
    return tableRows;
  }
};



var app = express()
app.use(cors())

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})



app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');