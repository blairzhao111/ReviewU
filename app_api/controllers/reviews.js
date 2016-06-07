var Location = require('../models/locations.js');
var util = require('./util.js');

var sendJSONResponse = util.sendJSONResponse;

//export section
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