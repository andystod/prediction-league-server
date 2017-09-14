'use strict';

const express = require('express');
const body_parser = require('body-parser');
var { buildSchema } = require('graphql');
const expressGraphQL = require('express-graphql');

// mongouser
// mOGr5qfWyvwkCPnw


var schema = buildSchema(`
  type User {
    id: String,
    name: String,
    predictions: [Prediction],
    email: String,
    telephone: String
  }

  type Prediction {
    match: Match,
    pick: Team,
    points: Int
  }

  type Match {
    home: Team,
    away: Team,
    score: Score
  }

  type Score {
    home: String,
    away: String
  }

  type Team {
    id: String
    name: String
  }

  type LeagueTableRow {
    id: String,
    user: User,
    gameweekPick: Team,
    gameweekPoints: Int,
    totalPoints: Int,
    position: Int
  }



interface Node {
  id: ID!
}

  type LeagueTableConnection {
  pageInfo: PageInfo
  edges: [LeagueTableEdge]
}
type LeagueTableEdge {
  node: LeagueTableRow!
  cursor: ID!
}
type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}
type LeagueTable implements Node {
  id: ID!
  leagueTableRows(first: Int, last: Int, before: ID, after: ID): LeagueTableConnection
}


  type Query {
    user(id: String): User,
    team(id: String): Team,
    leagueTable: LeagueTable,
    node(id: ID!): Node
  }

`);


const teams = [
  { id: 1, name: 'AFC Bournemouth' },
  { id: 2, name: 'Arsenal' },
  { id: 3, name: 'Brighton & Hove Albion' },
  { id: 4, name: 'Burnley' },
  { id: 5, name: 'Chelsea' },
  { id: 6, name: 'Crystal Palace' },
  { id: 7, name: 'Everton' },
  { id: 8, name: 'Huddersfield Town' },
  { id: 9, name: 'Leicester City' },
  { id: 10, name: 'Liverpool' },
  { id: 11, name: 'Manchester City' },
  { id: 12, name: 'Manchester United' },
  { id: 13, name: 'Newcastle United' },
  { id: 14, name: 'Southampton' },
  { id: 15, name: 'Stoke City' },
  { id: 16, name: 'Swansea City' },
  { id: 17, name: 'Tottenham Hotspur' },
  { id: 18, name: 'Watford' },
  { id: 19, name: 'West Bromwich Albion' },
  { id: 20, name: 'West Ham United' }
];

console.log(teams[0]);
console.log([teams[0], teams[1]]);

const match1 = {
  home: teams[4],
  away: teams[13],
  score: {home: "2", away: "3"}
};

const match2 = {
  home: teams[5],
  away: teams[17],
  score: {home: "1", away: "0"}
};

const match3 = {
  home: teams[15],
  away: teams[1],
  score: {home: "1", away: "1"}
};

const prediction1 = {
  match: match1,
  pick: teams[13],
  points: 3
}

const prediction2 = {
  match: match2,
  pick: teams[5],
  points: 2
}

const prediction3 = {
  match: match3,
  pick: teams[1],
  points: 1
}

const predictions = [prediction1, prediction2, prediction3, prediction1, prediction3, prediction2, prediction1, prediction2, prediction3];

// Maps id to User object
const users = [
  { id: 'a', name: 'Andrew Stoddart', predictions: predictions, email: 'andystod@hotmail.com', telephone: '08753543534' },
  { id: 'b', name: 'Garry McMahon', predictions: predictions, email: 'gmac@hotmail.com', telephone: '03123123123' },
  { id: 'c', name: 'Cormac Fagan', predictions: predictions, email: 'cormacfagan@hotmail.com', telephone: '031233333123' },
  { id: 'd', name: 'Enda McElhiney', predictions: predictions, email: 'endamac@hotmail.com', telephone: '03123122223' }
];

const tableRows = [
  { id: 'a', user: users[0], gameweekPick: teams[0], gameweekPoints: 3, totalPoints: 6, position: 1 },
  { id: 'b', user: users[1], gameweekPick: teams[12], gameweekPoints: 2, totalPoints: 5, position: 2 },
  { id: 'c', user: users[2], gameweekPick: teams[13], gameweekPoints: 0, totalPoints: 3, position: 3 },
  { id: 'd', user: users[3], gameweekPick: teams[19], gameweekPoints: 0, totalPoints: 3, position: 3 }];


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
  },
  leagueTable: function() {
    console.log('here1');
    console.log(tableRows);
    console.log(tableRows.length);
    return 1;
  }
};


var cors = require('cors')

// app.use('*', cors());


const app = express();

app.use(cors())

// app.get('/products/:id', function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for all origins!'})
// })




app.use('/graphql', 
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