'use strict';

const express = require('express');
const body_parser = require('body-parser');
var { buildSchema } = require('graphql');
const expressGraphQL = require('express-graphql');
var { makeExecutableSchema } = require('graphql-tools');
const { connectionFromArray } = require('graphql-relay');
const dynamodb = require('./dynamodb');

// mongouser
// mOGr5qfWyvwkCPnw


var typeDefs = `
  # User type
  type User {
    id: String,
    name: String,
    email: String,
    telephone: String
  }

  type Prediction {
    match: Match,
    pick: String,
    points: Int
  }

  type Match {
    home: String,
    away: String,
    score: Score
  }

  type Score {
    home: String,
    away: String
  }
  type Entry {
    id: String,
    user: User, 
    tablePosition: Int
    leaguePosition: Int
    gameweekPick: String,
    gameweekPoints: Int,
    totalPoints: Int,
    # Predictions picked by user
    predictions: [Prediction],
  }


type LeagueTable {
  id: ID!
  entries: [Entry]
}


  type Query {
    entry(id: String): Entry,
    #team(id: ID!): Team,
    leagueTable: LeagueTable
  }

`;


const teams = [
  'AFC Bournemouth',
  'Arsenal',
  'Brighton & Hove Albion',
  'Burnley',
  'Chelsea',
  'Crystal Palace',
  'Everton',
  'Huddersfield Town',
  'Leicester City',
  'Liverpool',
  'Manchester City',
  'Manchester United',
  'Newcastle United',
  'Southampton',
  'Stoke City',
  'Swansea City',
  'Tottenham Hotspur',
  'Watford',
  'West Bromwich Albion',
  'West Ham United'
];

console.log(teams[0]);
console.log([teams[0], teams[1]]);

const match1 = {
  home: teams[4],
  away: teams[13],
  score: { home: "2", away: "3" }
};

const match2 = {
  home: teams[5],
  away: teams[17],
  score: { home: "1", away: "0" }
};

const match3 = {
  home: teams[15],
  away: teams[1],
  score: { home: "1", away: "1" }
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
const predictionsDeleteMe = [prediction1, prediction2];

// Maps id to User object
const users = [
  { id: 'a', name: 'Andrew Stoddart', email: 'andystod@hotmail.com', telephone: '08753543534' },
  { id: 'b', name: 'Garry McMahon', email: 'gmac@hotmail.com', telephone: '03123123123' },
  { id: 'c', name: 'Cormac Fagan', email: 'cormacfagan@hotmail.com', telephone: '031233333123' },
  { id: 'd', name: 'Enda McElhiney', email: 'endamac@hotmail.com', telephone: '03123122223' }
];

const entries = [
  { id: 'a', user: users[0], gameweekPick: teams[0], gameweekPoints: 3, totalPoints: 6, tablePosition: 1, leaguePosition: 1, predictions: predictions },
  { id: 'b', user: users[1], gameweekPick: teams[12], gameweekPoints: 2, totalPoints: 5, tablePosition: 2, leaguePosition: 2, predictions: predictions },
  { id: 'c', user: users[2], gameweekPick: teams[13], gameweekPoints: 0, totalPoints: 3, tablePosition: 3, leaguePosition: 3, predictions: predictions },
  { id: 'd', user: users[3], gameweekPick: teams[19], gameweekPoints: 0, totalPoints: 3, tablePosition: 4, leaguePosition: 3, predictions: predictions }];


const resolvers = {
  Query: {
    entry: (_, { id }) =>
      entries.find(entry => entry.id === id),

    leagueTable: () => {
      console.log('a');
      var entries = dynamodb.getEntries();
      console.log(entries);
      return entries;
    },

  },
  Entry: {
    predictions: () => predictionsDeleteMe,
  },
  LeagueTable: {
    id: () => '123',
    entries: () => {
      console.log('b');
      return dynamodb.getEntries();
    }
  }
};







const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});



var cors = require('cors')

// app.use('*', cors());


const app = express();

app.use(cors())

// app.get('/products/:id', function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for all origins!'})
// })




app.use('/graphql',
  expressGraphQL(() => {
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