require('dotenv').config();
const { Promise } = require('bluebird');
const AWS = require('aws-sdk');

const dynamoConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_DYNAMODB,
  secretAccessKey: process.env.AWS_SECRET_KEY_DYNAMODB,
  region: 'eu-west-1'
};

const docClient = new AWS.DynamoDB.DocumentClient(dynamoConfig);

// Get single entry
function getEntry(entryID) {
  return new Promise(function (resolve, reject) {
    var params = {
      TableName: 'Entry',
      Key: { id: entryID }
    };

    docClient.get(params, function (err, data) {
      if (err) return reject(err);
      return resolve(data["Item"]);
    });

  });
}

module.exports = {
  getEntry: getEntry
}