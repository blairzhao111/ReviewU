var Location = require('../models/locations.js'),
	util = require('./util.js');

//private section
var sendJSONResponse = util.sendJSONResponse;

//update location's rating when a new review is added or an existing review is updated.
var updateLocationRating = function(location){
	var reviews = location.reviews,
		totalRating = 0;
	if(!reviews || reviews.length === 0){return;}
	reviews.forEach(function(review){
		totalRating += review.rating;
	});
	location.rating = totalRating/reviews.length;
	location.save(function(err){
		if(err){
			return console.error(err);
		}
	});
};

//add a given review to db 
var addReview = function(req, res, location){
	var reviews = location.reviews,
		body = req.body;
	reviews.unshift({
		author: body.author,
		rating: body.rating,
		reviewText: body.reviewText
	});
	location.save(function(err, result){
		var thisReview;
		if(err){
			sendJSONResponse(res, 400, err);
		}else{
			updateLocationRating(result);
			thisReview = result.reviews[result.reviews.length - 1];
			sendJSONResponse(res, 201, thisReview);
		}
	});
};

//export section
//find an instance of review by a locationid and a reviewid in db.
exports.findOneById = function(req, res){
	if(req.params && req.params.locationid && req.params.reviewid){
		Location
			.findById(req.params.locationid)
			.select('name reviews')
			.exec(function(err, location){
				var review, response;

				if(err){
					return sendJSONResponse(res, 404, err);
				}else if(!location){
					return sendJSONResponse(res, 404, {
						message: 'Required location not found!'
					});
				}

				if(location.reviews && location.reviews.length > 0){
					review = location.reviews.id(req.params.reviewid);
					if(review){
						response = {
							location: {
								name: location.name,
								id: req.params.locationid
							},
							review: review
						};
						sendJSONResponse(res, 200, response);
					}else{
						return sendJSONResponse(res, 404, {
							message: 'Reviewid not found!'
						});
					}
				}else{
					return sendJSONResponse(res, 404, {
						message: 'No review found!'
					});
				}
			});
	}else{
		sendJSONResponse(res, 404, {
			message: 'Both locationid and reviewid are required!'
		});
	}
};

//create a new review to a specific location by providing locationid and review data.
exports.createOne = function(req, res){
	var locationid = req.params.locationid;

	if(locationid){
		Location
			.findById(locationid)
			.select('reviews')
			.exec(function(err, result){
				if(err){
					return sendJSONResponse(res, 400, err);
				}else if(!result){
					return sendJSONResponse(res, 404, {
						message: 'Required locationid not found!'
					});
				}
				addReview(req, res, result);
			});
	}else{
		sendJSONResponse(res, 404, {
			message: 'locationid is required!'
		});
	}
};

//update a review subdocument 
exports.updateOneById = function(req, res){
	if( !req.params.locationid || !req.params.reviewid){
		return sendJSONResponse(res, 404, {
			message: 'Both locationid and reviewid are required!'
		});
	}
	Location
		.findById(locationid)
		.select('review')
		.exec(function(err, result){
			var thisReview,
				body = req.body;
			if(err){
				return sendJSONResponse(res, 404, err);
			}else if(!result){
				return sendJSONResponse(res, 404, {
					message: 'Required locationid not found!'
				});
			}
			if(result.reviews&&result.reviews.length>0){
				thisReview = result.reviews.id(req.params.reviewid);
				if(thisReview){
					thisReview.author = body.author;
					thisReview.rating = body.rating;
					thisReview.reviewText = body.reviewText;
					result.save(function(err, result){
						if(err){
							return sendJSONResponse(res, 404, err);
						}
						updateLocationRating(result);
						return sendJSONResponse(res, 200, thisReview);
					});
				}else{
					return sendJSONResponse(res, 404, {
						message: 'Required reviewid not found!'
					});
				}
			}else{
				sendJSONResponse(res, 404, {
					message: 'No review to update!'
				});
			}
		});
};