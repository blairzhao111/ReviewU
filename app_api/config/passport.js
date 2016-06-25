var passport = require('passport'),
	localStrategy = require('passport-local').Strategy,
	mongoose = require('mongoose'),
	User = require('../models/users.js');

//set passport local strategy
passport.use(new localStrategy({
	usernameField: 'email',
	passwordField: 'ps'
}, function(email, password, done){
	User.findOne({
		email: email
	}, function(err, user){
		if(err){
			return done(err);
		}

		if(!user){
			return done(null, false, {
				message: 'Invalid email'
			});
		}

		if(!user.validatePassword(password)){
			return done(null, false, {
				message: 'Invalid password'
			});
		}

		return done(null, user);
	});
}));