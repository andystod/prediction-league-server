//import AWS from 'aws-sdk';
const { Promise } = require('bluebird');
const dynamoose = require('dynamoose');
const proxy = require('proxy-agent');

console.log(process.env.PROXY);

dynamoose.AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_DYNAMODB,
  secretAccessKey: process.env.AWS_SECRET_KEY_DYNAMODB,
  region: 'eu-west-1'
});

var getEntries = function getEntries() {

  return new Promise(function (resolve, reject) {

    var Entry = dynamoose.model('Entry', { EntryId: { type: String, hashKey: true }, TotalPoints: { type: Number, rangeKey: true } });

    console.log('here4');

    Entry.scan().exec().then(function (entries) {
      console.log(entries);
      return entries;
    }).then(function (entries) {
      if (entries.lastKey) { // More entries to get
        Entry.scan().startAt(entries.lastKey).exec().then(function (entries) {
          console.log(entries);
          return resolve(entries);
        });
      }
      else {
        return resolve(entries);
      }
    })
      .catch(function (error) {
        console.log(error);
        return reject(error);
      });
  });
}

module.exports = {
  getEntries: getEntries
}