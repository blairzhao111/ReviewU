var nodemailer = require('nodemailer'),
	util = require('../util/util.js'),
	cachePrevUrl = util.cachePrevUrl;

var checkMessageInfo = function(message){
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

	if(!message.name || !message.email || !message.subject || !message.text){
		return "Please fill in all fields and send again!";
	}else if(!message.email.match(emailPattern)){
		return "Invalid email, please check and send again!";
	}else{
		return null;
	}
};

/* Get About Page*/
module.exports.about = function (req, res) {
  cachePrevUrl(req);
  res.render('generic-text', { 
  	user: req.session.account?req.session.account.user:null,
  	title: 'About ReviewU',
  	content: 'ReviewU was created to help people find the best places near their current location. \n\n Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis facilisis purus, in sollicitudin orci condimentum at. Sed tincidunt urna eu varius accumsan. Suspendisse convallis lobortis consectetur. Ut pellentesque ut nulla nec pretium. Vestibulum semper, elit ac fermentum elementum, tellus erat rhoncus purus, et fringilla ipsum tortor non lacus. Praesent eget quam ut justo cursus ultricies. In ut volutpat nisl. Donec feugiat cursus rhoncus. Suspendisse mollis, nunc in efficitur maximus, massa massa blandit quam, sed pulvinar magna ipsum ac ipsum. Pellentesque venenatis consectetur tortor ac ullamcorper. Sed pulvinar tincidunt leo, sed semper turpis faucibus non. Donec auctor magna suscipit turpis facilisis mollis. Maecenas nisl orci, efficitur sed erat vel, vulputate vulputate turpis. Sed dictum quam at dolor blandit interdum et mollis est. Donec ornare dapibus erat a volutpat. Nullam aliquet congue metus, eu convallis magna. \n\n Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis facilisis purus, in sollicitudin orci condimentum at. Sed tincidunt urna eu varius accumsan. Suspendisse convallis lobortis consectetur. Ut pellentesque ut nulla nec pretium. Vestibulum semper, elit ac fermentum elementum, tellus erat rhoncus purus, et fringilla ipsum tortor non lacus. Praesent eget quam ut justo cursus ultricies. In ut volutpat nisl. Donec feugiat cursus rhoncus. Suspendisse mollis, nunc in efficitur maximus, massa massa blandit quam, sed pulvinar magna ipsum ac ipsum. Pellentesque venenatis consectetur tortor ac ullamcorper. Sed pulvinar tincidunt leo, sed semper turpis faucibus non. Donec auctor magna suscipit turpis facilisis mollis. Maecenas nisl orci, efficitur sed erat vel, vulputate vulputate turpis. Sed dictum quam at dolor blandit interdum et mollis est. Donec ornare dapibus erat a volutpat. Nullam aliquet congue metus, eu convallis magna.'
  });
};

//handle incoming messageMe message
module.exports.messageMe = function(req, res){
	var msg = {
		name: req.body.name,
		email: req.body.email,
		subject: req.body.subject,
		text: req.body.messageText
	},
	message = null,
	redirectUrl = req.session.returnTo || '/',
	mailTransport = nodemailer.createTransport(process.env.EMAIL_CREDENTIAL);

	message = checkMessageInfo(msg);
	if(message){
		req.session.error = {
			type: 'messageMe',
			message: message		
		};
	}else{
		req.session.success = {
			type: 'messageMe',
			message: 'The message has been received, thank you!'
		};

		mailTransport.sendMail({
			from: '"MessageMe" <messageMe-noreply@ReviewU.com>',
			to: 'jzhao34@buffalo.edu, blairzhao111@gmail.com',
			subject: msg.subject,
			text : "Send by " + msg.name + " at " + msg.email + "\n\n" + msg.text
		}, function(err){
			if(err){
				console.log("Unable to send email: " + err);
			}
		});
	}

	res.redirect(303, redirectUrl);
};