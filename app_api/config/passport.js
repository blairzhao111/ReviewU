var passport = require('passport'),
	localStrategy = require('passport-local').Strategy,
	mongoose = require('mongoose'),
	User = require('../models/users.js');

//set password local strategy
passport.use(new localStrategy({
	usernameField: 'email'
}, function(username, password, done){
	User.findOne({
		email: username
	}, function(err, user){
		if(err){
			return done(err);
		}else if(!user){
			return done(null, false, {
				message: 'Invalid email'
			});
		}else{
			if(User.validatePassword(password)){
				return done(null, user);
			}else{
				return done(null, false, {
					message: 'Invalid password'
				});
			}
		}
	});
}));