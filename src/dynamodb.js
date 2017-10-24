
// var proxy = require('proxy-agent');

var dynamoose = require('dynamoose');

dynamoose.AWS.config.update({
    accessKeyId : '',
    secretAccessKey : '',
    region : 'eu-west-1'
});

// dynamoose.AWS.config.update({
//   accessKeyId : '',
//   secretAccessKey : '',
//   region : 'eu-west-1',
//   httpOptions: { agent: proxy('') }
// });

//dynamoose.local();

// Create cat model with default options
var Entry = dynamoose.model('Entry', { EntryId : {type: String, hashKey: true}, TotalPoints : {type: Number, rangeKey: true} });

// Create a new cat object
var garfield = new Entry({EntryId: '333', TotalPoints : 54});

// Save to DynamoDB
garfield.save(function(error) {
  console.log(error);
});



// Lookup in DynamoDB
Entry.get({EntryId: '444', TotalPoints : 51})
.then(function (badCat) {
  console.log('Never trust a smiling cat. - ' + badCat.TotalPoints);
});