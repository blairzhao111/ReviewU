//require Location model 
var Location = require('../models/locations.js');
var util = require('./util.js');

//private section
var sendJSONResponse = util.sendJSONResponse;

//export section
exports.listByDistance = function(req, res){

};

exports.create = function(req, res){
	sendJSONResponse(res, 200, {
		status: 'success'
	});
};

//read a location instance from db by specifiying its locationid through parameters
exports.findOneById = function(req, res){
	if(req.params && req.params.locationid){
		Location
			.findById(req.params.locationid)
			.exec(function(err, location){
				if(err){
					return sendJSONResponse(res, 404, err);
				}else if(!location){
					return sendJSONResponse(res, 404, {
						message: 'Requested location not found!'
					});
				}
				sendJSONResponse(res, 200, location);
			});
	}else{
		sendJSONResponse(res, 404, {
			message: 'No locationid is specified in request!'
		});
	}
};

exports.updateOneById = function(req, res){

};

exports.deleteOneById = function(req, res){

};
