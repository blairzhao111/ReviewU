var DEFAULT_MAX_DISTANCE = 2000, //unit is in meter
	DEFAULT_RETURN_NUMBER = 10,
    //require Location model 
	Location = require('../models/locations.js'),
	util = require('./util.js');

//private section
var sendJSONResponse = util.sendJSONResponse;

//helper object for calculation in geoNear method
var disConvert = (function(){
	return {
		mToKm: function(meters){
			return meters?meters/1000:undefined;
		},
		kmToM: function(km){
			return km?1000*km:undefined;
		}
	};
})();

//process returned results from geoNear method and return a list of processed objects.
var generateList = function(results){
	var locations = [];
	results.forEach(function(result){
		locations.push({
			distance: result.dis,
			name: result.obj.name,
			address: result.obj.address,
			rating: result.obj.rating,
			facilities: result.obj.facilities,
			_id: result.obj._id
		});
	});
	return locations;
};


//export section

//return a list of processed locations by specified lat, lng(both required), num and maxdis(optional).
//url pattern: ...host:port/api/locations?lng=[]&lat=[](&maxdis=[]&num=[]) with get method.
exports.listByDistance = function(req, res){
	var lng = parseFloat(req.query.lng),
		lat = parseFloat(req.query.lat),
		maxdis = parseFloat(req.query.maxdis),
		num = parseInt(req.query.num),
		point = {
			type: 'Point',
			coordinates: [lng, lat]
		},
		geoOptions = {
			spherical: true,
			//default maximum distance is 2km.
			maxDistance: disConvert.kmToM(maxdis) || DEFAULT_MAX_DISTANCE,
			//default return number is 10
			num: num || DEFAULT_RETURN_NUMBER
		};

	if(!lng || !lat){
		return sendJSONResponse(res, 404, {
			message: 'lng and lat are required!'
		});
	}

	Location.geoNear(point, geoOptions, function(err, results, stats){
		if(err){
			return sendJSONResponse(res, 404, err);
		}
		//processing results data and return processed data as response
		sendJSONResponse(res, 200, generateList(results));
	});
};

//read a location instance from db by specifiying its locationid through parameters
//url pattern: ...host:port/api/locations/locationid with get method
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


//create a new instance of location document in mongodb.
exports.createOne = function(req, res){
	var location,
		body = req.body;

	location = {
		name: body.name,
		address: body.address,
		facilities: body.facilities.split(','),
		coords: [parseFloat(body.lng),parseFloat(body.lat)],
		openingTImes: [{
			days: body.day_week,
			opening: body.opening_week,
			closing: body.closing_week,
			closed: body.closed_week
		}, {
			days: body.day_sat,
			opening: body.opening_sat,
			closing: body.closing_sat,
			closed: body.closed_sat			
		}, {
			days: body.day_sun,
			opening: body.opening_sun,
			closing: body.closing_sun,
			closed: body.closed_sun			
		}]
	};

	Location.create(location, function(err, result){
		if(err){
			return sendJSONResponse(res, 400, err);
		}
		sendJSONResponse(res, 201, result);
	});
};

exports.updateOneById = function(req, res){
	
};

exports.deleteOneById = function(req, res){

};
