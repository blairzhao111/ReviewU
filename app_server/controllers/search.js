var request = require('request'),
    util = require('../util/util.js'),
    config = require('../config/config.js'),
    serverUrl = config.serverUrl;

var formatCategory = util.formatCategory,
	formatDistance = util.formatDistance;

//issue http request to app's api for getting a list of locations identified by name.
var getLocationByName = function(req, res, locationName, callback){
  var name = locationName,
  	  path = '/api/locations/name/' + name;
      requestOptions = {
          url: serverUrl + path,
          method: 'GET',
          json: {}
      };

  request(requestOptions, function(err, response, body){
  	if(err){
  		console.error(err);
  	}else{
  		body = JSON.parse(body);
  		if(response.statusCode === 200){
  			callback(req, res, body);
  		}else{
  			console.error(body);
  			renderErrorPage(req, res, response.statusCode);
  		}
  	}
  });  
};

//issue http request to app's api for getting a list of locations identified by maximum distance.
var getLocationByDistance = function(req, res, maxdis, callback){
  var path = '/api/locations',
      requestOptions = {
          url: serverUrl + path,
          method: 'GET',
          json: {},
          qs: {
            lng: process.env.NODE_ENV==='production'?'-78.8148184':'-0.9692599',
            lat: process.env.NODE_ENV==='production'?'43.0056247':'51.378091',
            maxdis: maxdis/1000   //unit in kilometer
          }
      };  

  request(requestOptions, function(err, response, body){
      if(err){
        console.log(err);
      }else{
        body = JSON.parse(body);
        if(response.statusCode === 200){
        	callback(req, res, body);
        }else{
  			console.error(body);
  			renderErrorPage(req, res, response.statusCode);
  		}
      }  
  });
};

//issue http request to app's api for getting a list of locations identified by category.
var getLocationByCategory = function(req, res, category, callback){
	var path = '/api/locations/category/' + category,
		requestOptions = {
			url: serverUrl + path,
			method: 'GET',
			json: {}
		};

	request(requestOptions, function(err, response, body){
		if(err){
			console.error(err);
		}else{
			body = JSON.parse(body);
			if(response.statusCode === 200){
				callback(req, res, body);
			}else{
				console.error(body);
				renderErrorPage(req, res, response.statusCode);
			}
		}
	});
};

var getLocationByRating = function(req, res, rating, callback){
	var path = '/api/locations/rating/'+rating.dir + '/' + rating.val,
		requestOptions = {
			url: serverUrl + path,
			method: 'GET',
			json: {}
		};

	request(requestOptions, function(err, response, body){
		if(err){
			console.error(err);
		}else{
			body = JSON.parse(body);
			if(response.statusCode === 200){
				console.log(body);
				callback(req, res, body);
			}else{
				console.error(body);
				renderErrorPage(req, res, response.statusCode);
			}
		}
	});
};

//filters 
var nameFilter = function(locations, name, criterion){
	if(!name){return locations;}
	if(!locations.length){
		criterion.name = name;
		return locations;
	}
	var result = [],
		reg = '/' + name + '+/i'
	locations.forEach(function(location){
		if(location.match(reg)){
			result.push(location);
		}
	});
	criterion.name = name;
	return result;
};

var ratingFilter = function(locations, ratingDir, ratingVal, criterion){
	if(!ratingVal || !ratingVal){return locations;}
	if(!locations.length){
		criterion.rating = formatRating(ratingDir, ratingVal);
		return locations;
	}

	var result = [];
	locations.forEach(function(location){
		switch(ratingDir){
			case 'gt':
				if(location.rating > ratingVal){result.push(location);}
				break;
			case 'gte':
				if(location.rating >= ratingVal){result.push(location);}
				break;
			case 'equals':
				if(location.rating == ratingVal){result.push(location);}
				break;
			case 'lte':
				if(location.rating <= ratingVal){result.push(location);}
				break;
			case 'lt':
				if(location.rating < ratingVal){result.push(location);}
				break;
			default:
				break;
		}
	});	

	criterion.rating = formatRating(ratingDir, ratingVal);
	return result;
};

var distanceFilter = function(locations, maxdis, criterion){
	if(!maxdis || !locations.length){return locations;}
	return locations;
};

var categoryFilter = function(locations, category, criterion){
	if(!category){return locations;}
	if(!locations.length){
		criterion.category = formatCategory(category);		
		return locations;
	}

	var result = [];
	locations.forEach(function(location){
		if(category === 'bar&cafe'){
			if(location.category === 'bar' || location.category === 'cafe'){
				result.push(location);
			}
		}else{
			if(location.category === category){
				result.push(location);
			}
		}
	});
	criterion.category = formatCategory(category);
	return result;
};

var formatRating = function(ratingDir, ratingVal){
	var result;
	switch(ratingDir){
		case 'gt':
			result = 'greater than ';
			break;
		case 'gte':
			result = 'greater than or equals to ';
			break;
		case 'equals':
			result = 'equals to ';
			break;
		case 'lte':
			result = 'less than or equals to ';
			break;
		case 'lt':
			result = 'less than ';
			break;
		default:
			break;
	}
	result += ratingVal;
	return result;
}

/**
*	Functions for rendering pages
**/

//function for rendering any error page
var renderErrorPage = util.renderErrorPage;

//function for rendering the search result page
var renderSearchResultList = function(req, res, locations, criterion){
	if(locations.length>0){
		locations.forEach(function(location){
			location.category = formatCategory(location.category);
		});
	}
	res.render('searchResult-list', {
		user: req.session.account?req.session.account.user:null,
		locations: locations.length?locations:null,
		resultNum: locations.length,
		criterion: criterion
	});
};


/**
*	Export section
**/
exports.searchByName = function(req, res){
	var name = req.query.searchContent;

	//application level validation
	if(!name){
		//res.status(304);
		return res.send('invalid');
		//return res.redirect(req.session.prevUrl)
	}

	getLocationByName(req, res, name, function(req, res, locations){
		var criterion = {
			name: name
		};
		renderSearchResultList(req, res, locations, criterion);
	});
};

exports.advanceSearch = function(req, res){
	var name = req.query.name,
		ratingDir = req.query.ratingDir,
		ratingVal = req.query.ratingVal,
		maxdis = req.query.maxdis,
		category = req.query.category,
		criterion = {};

	req.session.prevUrl = req.url;

	if(maxdis){
		getLocationByDistance(req, res, maxdis, function(req, res, locations){
			criterion.distance = maxdis + 'm';
			locations = nameFilter(locations, name, criterion);
			locations = ratingFilter(locations, ratingDir, ratingVal, criterion);
			locations = categoryFilter(locations, category, criterion);

			return renderSearchResultList(req, res, locations, criterion);
		});
	}else if(name){
		getLocationByName(req, res, name, function(req, res, locations){
			criterion.name = name;
			locations = ratingFilter(locations, ratingDir, ratingVal, criterion);
			locations = categoryFilter(locations, category, criterion);

			return renderSearchResultList(req, res, locations, criterion);
		});
	}else if(ratingDir&&ratingVal){
		var rating = {
			dir: ratingDir,
			val: ratingVal
		};

		//application level validation
		var dirInvalid = rating.dir!=='gt'&&rating.dir!=='gte'&&rating.dir!=='equals'&&rating.dir!=='lte'&&rating.dir!=='lt',
			valInvalid = rating.val<1 || rating.val>5;

		if(dirInvalid || valInvalid){
			return res.send('Invalid rating direction or invalid rating value');
		}

		getLocationByRating(req, res, rating, function(req, res, locations){
			criterion.rating = formatRating(ratingDir, ratingVal);
			locations = categoryFilter(locations, category, criterion);

			return renderSearchResultList(req, res, locations, criterion);
		});
	}else if(category){
		getLocationByCategory(req, res, category, function(req, res, locations){
			criterion.category = formatCategory(category);
			return renderSearchResultList(req, res, locations, criterion);
		});
	}else{
		res.send('invalid');
/*		res.status(304);
		return res.redirect(req.session.prevUrl)*/
	}

};