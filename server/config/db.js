/**
 * Our Database Interface
 */
var mongoose = require('mongoose');

// Models
var UserModel = require('../models/users');
var ActivityModel = require('../models/activity');

// Connections
var developmentDb = 'mongodb://localhost/activitypick';
var productionDb = 'urlToYourProductionMongoDb';
var testDb = 'mongodb://localhost/activitypick_test';
var usedDb;

// If we're in development...
if (process.env.NODE_ENV === 'development') {
    // set our database to the development one
    usedDb = developmentDb;
    // connect to it via mongoose
    mongoose.connect(usedDb);
}

// If we're in production...
if (process.env.NODE_ENV === 'production') {
    // set our database to the development one
    usedDb = productionDb;
    // connect to it via mongoose
    mongoose.connect(usedDb);
}

// If we're in test...
if (process.env.NODE_ENV === 'test') {
    // set our database to the development one
    usedDb = testDb;
    // connect to it via mongoose
    mongoose.connect(usedDb);
}

// get an instance of our connection to our database
var db = mongoose.connection;

// Logs that the connection has successfully been opened
db.on('error', console.error.bind(console, 'connection error:'));
// Open the connection
db.once('open', function callback () {
    console.log('Database Connection Successfully Opened at ' + usedDb);
});

exports.users = UserModel;
exports.activities = ActivityModel;