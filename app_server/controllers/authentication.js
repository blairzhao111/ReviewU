var request = require('request'),
	jwt = require('jsonwebtoken'),
    util = require('../util/util.js'),
    config = require('../config/config.js'),
    serverUrl = config.serverUrl;

//function for rendering any error page
var renderErrorPage = util.renderErrorPage;

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
    	var message;
    	if(err){
    		console.log(err);
    	}else{
    		body = JSON.parse(body);
    		if(response.statusCode === 400){
    			message = body.message;
    			//redirect back and show error message
    			res.send('400');
    		}else if(response.statusCode === 404){
    			if(body.message){
    				message = body.message;
    				//redirect back and show error message
    				res.send('404');
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
    	var statusCode;
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
    				req.session.customError = {
    					type: 'login',
    					message: body.message.toString()
    				};
    				res.redirect(303, req.session.returnTo);
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
		emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

	//application-level data validation
	if(!email||!ps){
		//redirect back and show error message
	}else if(!email.match(emailPattern)){
		//redirect back and show error message
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
			var redirectUrl;

			if(err){
				return renderErrorPage(req, res, 404);
			}
			session.account.user = decoded;
			//redirect back and show error message
			redirectUrl = session.returnTo || '/';
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
		emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

	//application-level data validation
	if(!email||!name||!ps||!ps2){
		res.send("app level error");
	}else if(!email.match(emailPattern)){
		res.send("app level error");
	}else if(!matchPasswords(ps, ps2)){
		res.send("app level error");
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
			var redirectUrl;

			if(err){
				console.log(err);
				return renderErrorPage(req, res, 404);
			}

			session.account.user = decoded;
			redirectUrl = session.returnTo || '/';

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