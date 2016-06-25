var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//define subdocument schema
var openingTimeSchema = new Schema({
	days: {
		type: String,
		required: true
	},
	opening: String,
	closing: String,
	closed: {
		type: Boolean,
		required: true
	}
});

var reviewSchema = new Schema({
	author: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		required: true,
		min: 0,
		max: 5
	},
	reviewText: {
		type: String,
		required: true
	},
	timestamp: {
		type: Date,
		'default': Date.now
	}
});

//define main document schema
var locationSchema = new Schema({
	category: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		'default': 0,
		min: 0,
		max: 5
	},
	facilities: [String],
	coords: {
		type: [Number],
		index: '2dsphere',
		required: true
	},
	openingTimes: [openingTimeSchema],
	reviews: [reviewSchema]
});

//create location model and export it
module.exports = mongoose.model("Location", locationSchema);