'use strict';

const express = require('express');
const body_parser = require('body-parser');
var { buildSchema } = require('graphql');
const expressGraphQL = require('express-graphql');

// mongouser
// mOGr5qfWyvwkCPnw


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


var cors = require('cors')

// app.use('*', cors());





const app = express();

app.use('/graphql', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
}, 

expressGraphQL( () => {
		return {
			graphiql: true,
			schema: schema,
            rootValue: root,
		}
	}));

// app.use( body_parser.json({ limit: '50mb' }) );

// app.options('/graphql', cors())

// app.use(
// 	'/graphql',
// 	expressGraphQL( () => {
// 		return {
// 			graphiql: true,
// 			schema: schema,
//             rootValue: root,
// 		}
// 	})
// );

module.exports = app;