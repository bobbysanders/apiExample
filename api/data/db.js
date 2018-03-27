//require the mongoose package for db management
var mongoose = require('mongoose');
//set db url
var dburl = 'mongodb://localhost:27017/locations';
//set bluebird as mongoose's promise library
mongoose.Promise = require('bluebird');
var fs = require('fs');

//var creds = JSON.parse(fs.readFileSync('/home/administrator/.mongoCreds.json'))

options = {
    //useMongoClient: true,
    //user: creds.user,
    //pass: creds.pass,
    //auth: {
    //    authdb: "admin"
    //}
}

//initialize connection
mongoose.connect(dburl, options);



//Connection events
mongoose.connection.on('connected', function () {
    //log connection successful
    console.log('Mongoose connected to ' + dburl);
});
mongoose.connection.on('disconnected', function () {
    //log when disconnected
    console.log('Mongoose disconnected');
});
mongoose.connection.on('error', function (err) {
    //log errors
    console.log('Mongoose connection error: ' + err);
});

//For nodemon restarts
process.once('SIGUSR2', function () {
    mongoose.connection.close(function () {
        console.log('Nodemon restart (SIGUSR2)');
        process.kill(process.pid, 'SIGUSR2')
    })
});

// For app termination
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('App termination (SIGINT)');
        process.exit(0);
    })
});

// For Heroku app termination
process.on('SIGTERM', function () {
    mongoose.connection.close(function () {
        console.log('App termination (SIGTERM)');
        process.exit(0);
    })
});

require('./location.model');