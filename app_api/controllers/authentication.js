var passport = require('passport'),
	mongoose = require('mongoose'),
	User = require('../models/users.js'),
	util = require('../utils/util.js');

var sendJSONResponse = util.sendJSONResponse;

//controller for handling login
exports.login = function(req, res){
	var email = req.body.email,
		ps = req.body.ps,
		emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

	if(!email||!ps){
		return sendJSONResponse(res, 400, {
			message: "All fields are required!"
		});
	}else if(!email.match(emailPattern)){
		return sendJSONResponse(res, 404, {
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

//controller for handling registration
exports.register = function(req, res){
	var email = req.body.email,
		name = req.body.name,
		ps = req.body.ps,
		emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

	if(!email||!name||!ps){
		return sendJSONResponse(res, 400, {
			message: 'All fields are requird!'
		});
	}else if(!email.match(emailPattern)){
		return sendJSONResponse(res, 404, {
			message: 'Invalid email format!'
		});
	}	

	var user = new User();
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
};