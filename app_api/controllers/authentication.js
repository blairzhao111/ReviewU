var passport = require('passport'),
	mongoose = require('mongoose'),
	User = require('../models/users.js'),
	util = require('../utils/util.js');

var sendJSONResponse = util.sendJSONResponse;

var matchPassword = function(ps1, ps2){
	return ps1 === ps2;
};

//controller for handling login action
exports.login = function(req, res){
	var email = req.body.email,
		ps = req.body.ps,
		emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

	if(!email||!ps){
		return sendJSONResponse(res, 400, {
			message: "All fields are required!"
		});
	}else if(!email.match(emailPattern)){
		return sendJSONResponse(res, 400, {
			message: "Invalid email format!"
		});
	}

	//delegate responibility to passport
	passport.authenticate('local', function(err, user, info){
		var token;

		if(err){
			return sendJSONResponse(res, 404, err);
		}

		if(user){
			token = user.generateJwt();
			sendJSONResponse(res, 200, {
				token: token
			});
		}else{
			sendJSONResponse(res, 401, info);
		}
	})(req, res);
};

//controller for handling registration action
exports.register = function(req, res){
	var email = req.body.email,
		name = req.body.name,
		ps = req.body.ps,
		ps2 = req.body.ps2,
		emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

	if(!email||!name||!ps){
		return sendJSONResponse(res, 400, {
			message: 'All fields are requird!'
		});
	}else if(!email.match(emailPattern)){
		return sendJSONResponse(res, 400, {
			message: 'Invalid email format!'
		});
	}else if(!matchPassword(ps,ps2)){
		return sendJSONResponse(res, 400, {
			message: 'Passwords not matching!'
		});
	}

	User
		.findOne({
			email: email
		})
		.exec(function(err, user){
			var user;

			if(err){
				return sendJSONResponse(res, 404, err);
			}else if(user){
				return sendJSONResponse(res, 404, {
					message: 'User already exists!'
				});
			}else{
				user = new User();
				user.email = email;
				user.name = name;
				user.setPassword(ps);

				user.save(function(err){
					var token;
					if(err){
						return sendJSONResponse(res, 404, err);
					}else{
						token = user.generateJwt();
						return sendJSONResponse(res, 200, {
							token: token
						});
					}
				});	
			}
		});
};