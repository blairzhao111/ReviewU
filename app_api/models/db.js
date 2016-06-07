
var mongoose = require('mongoose');
var connection = mongoose.connection;
var shutdown;

//set mongodb URI based on environment, by default it's development.
var dbURI = 'mongodb://localhost/ReviewU';

//if on live environment, use heroku's MONGOLAB_URI environment variable to set connection.
if(process.env.NODE_ENV === 'production'){
	dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);


//Listen for Mongoose connection events and output statuses to console
connection.on('connected', function(){
	console.log("Mongoose connected to " + dbURI);
});

connection.on('error', function(err){
	console.error("Mongoose connection error: " + err);
});

connection.on('disconnected', function(){
	console.log('Mongoose is disconnected.');
});

//close the connection when several situations happen
shutdown = function(msg, callback){
	connection.close(function(){
		console.log("Mongoose is disconnected through " + msg);
		callback();
	});
};

//for nodemon restart
/*process.once('SIGUSR2', function(){
	shutdown('nodemon restart', function(){
		process.kill(process.pid, 'SIGUSR2');
	});
});*/

//for local termation.
process.on('SIGINT', function(){
	shutdown("local app termination", function(){
		process.exit(0);
	});
});

//for heroku app termination. 
process.on('SIGTERM', function(){
	shutdown("heroku app termination", function(){
		process.exit(0);
	});
});

require('./locations.js');
