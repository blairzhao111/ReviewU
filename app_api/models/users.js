var crypto = require('crypto'),
	jwt = require('jsonwebtoken'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//define user schema
var userSchema = new Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	hash: String,
	salt: String
});

//define user model's methods
userSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validatePassword = function(password){
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return hash === this.hash;
};

userSchema.methods.generateJwt = function(){
	//jwt would be valid in a week
	var expiry = new Date();
	expiry.setDate(expiry.getDate()+7);

	return jwt.sign({
		id: this._id,
		name: this.name,
		email: this.email,
		expire: parseInt(expiry.getDate()/1000)
	}, process.env.JWT_SECRET);
};

//create user model and export it
module.exports = mongoose.model("User", userSchema);