var request = require('request'),
	jwt = require('jsonwebtoken'),
    util = require('../util/util.js'),
    config = require('../config/config.js'),
    serverUrl = config.serverUrl;

//function for rendering any error page
var renderErrorPage = util.renderErrorPage,
	getToken = util.getToken;

//function for checting if two given passwords are the same.
var matchPasswords = function(ps1, ps2){
	return ps1 === ps2;
};

//function that sending register request to login api and get result back.
var doRegister = function(req, res, userData, callback){
	var path = '/api/register',
	    requestOptions = {
          url: serverUrl + path,
          method: 'POST',
          json: userData
        };

    request(requestOptions, function(err, response, body){
    	var redirectUrl;
    	if(err){
    		console.log(err);
    	}else{
    		body = JSON.parse(body);
    		redirectUrl = req.session.returnTo || '/';
    		if(response.statusCode === 400){
    			//redirect back and show error message
				req.session.error = {
					type: 'register',
					message: body.message.toString()
				};
				res.redirect(303, redirectUrl);	
    		}else if(response.statusCode === 404){
    			if(body.message){
    				//redirect back and show error message
					req.session.error = {
						type: 'register',
						message: body.message.toString()
					};
					res.redirect(303, redirectUrl);	
    			}else{
    				return renderErrorPage(req, res, 404);
    			}
    		}else{
    			return callback(req, res, body.token);
    		}
    	}
    });
};

//function that sending login request to login api and get result back.
var doLogin = function(req, res, userData, callback){
	var path = '/api/login',
	    requestOptions = {
          url: serverUrl + path,
          method: 'POST',
          json: userData
        };

    request(requestOptions, function(err, response, body){
    	var statusCode, redirectUrl;
    	if(err){
    		console.log(err);
    	}else{
    		body = JSON.parse(body);
    		statusCode = response.statusCode;
    		if(statusCode === 200){
    			return callback(req, res, body.token);
    		}else{
    			if(statusCode === 400 || statusCode === 401){
    				//redirect back to previous page and show error message
    				req.session.error = {
    					type: 'login',
    					message: body.message.toString()
    				};

    				redirectUrl = req.session.returnTo || '/';
    				res.redirect(redirectUrl);
    			}else{
    				return renderErrorPage(req, res, statusCode);
    			}
    		}
    	}
    });
};

var renderRegisterSuccessfulPage = function(req, res){
	res.render('generic-text', {
		user: req.session.account?req.session.account.user:null,
		title: "Register Successful",
		content: req.session.account.user.name + " , thank you for joining us! We hope you would enjoy using ReviewU.",
		link: {
			url: req.session.returnTo || '/',
			text: 'Return to previous page...'
		}
	});
};

//export section
//login controller
exports.login = function(req, res){
	var body = req.body,
		email = body.email,
		ps = body.ps,
		emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
		redirectUrl = req.session.returnTo || '/';

	//application-level data validation
	if(!email||!ps){
		//redirect back and show error message
		req.session.error = {
			type: 'login',
			message: "Please fill in all fields and try again!"
		};
		res.redirect(303, redirectUrl);		
	}else if(!email.match(emailPattern)){
		//redirect back and show error message
		req.session.error = {
			type: 'login',
			message: "Invalid email, please check and try again!"
		};
		res.redirect(303, redirectUrl);	
	}

	doLogin(req, res, {
		email: email,
		ps: ps
	}, function(req, res, token){
		var session = req.session;

		if(!session.account){
			session.account = {};
		}

		session.account.token = token;

		jwt.verify(token, process.env.JWT_SECRET, function(err, decoded){
			if(err){
				return renderErrorPage(req, res, 404);
			}

			session.account.user = decoded;
			//redirect back and show error message
			res.redirect(redirectUrl);
		});
	});
};

//register(signup) controller
exports.register = function(req, res){
	var body = req.body,
		email = body.email,
		name = body.name,
		ps = body.ps,
		ps2 = body.ps2,
		emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
		redirectUrl = req.session.returnTo || '/';

	//application-level data validation
	if(!email||!name||!ps||!ps2){
		req.session.error = {
			type: 'register',
			message: "Please fill in all fields and try again!"
		};
		res.redirect(303, redirectUrl);		
	}else if(!email.match(emailPattern)){
		req.session.error = {
			type: 'register',
			message: "Invalid email, please check and try again!"
		};
		res.redirect(303, redirectUrl);		
	}else if(!matchPasswords(ps, ps2)){
		req.session.error = {
			type: 'register',
			message: "password does not match verify password!"
		};
		res.redirect(303, redirectUrl);		
	}

	doRegister(req, res, {
		email: email,
		name: name,
		ps: ps,
		ps2: ps2
	}, function(req, res, token){
		var session = req.session;

		if(!session.account){
			session.account = {};
		}

		session.account.token = token;

		jwt.verify(token, process.env.JWT_SECRET, function(err, decoded){

			if(err){
				console.log(err);
				return renderErrorPage(req, res, 404);
			}

			session.account.user = decoded;
			renderRegisterSuccessfulPage(req, res)
		});
	});
};

//logout controller
exports.logout = function(req, res){
	var session = req.session,
		redirectUrl;

	if(session.account){
		session.account = null;
	}

	redirectUrl = req.session.returnTo || '/';
	res.redirect(redirectUrl);
};