var request = require('request'),
    util = require('../util/util.js'),
    config = require('../config/config.js'),
    serverUrl = config.serverUrl;

var formatCategory = util.formatCategory;

//function for rendering any error page
var renderErrorPage = util.renderErrorPage;

//function for rendering the search result page
var renderSearchResultList = function(req, res, locations){
	res.render('searchResult-list', {
		locations: locations.length?locations:null,
		resultNum: locations.length
	});
};

//export section
exports.searchByName = function(req, res){
  var name = req.query.searchContent,
  	  path = '/api/locations/name/' + name;
      requestOptions = {
          url: serverUrl + path,
          method: 'GET',
          json: {}
      };

  //application level validation
  if(!name){
  	res.send('name is empty!');
  }

  request(requestOptions, function(err, response, body){
  	if(err){
  		console.error(err);
  	}else{
  		body = JSON.parse(body);
  		if(response.statusCode === 200){
	  		if(body.length>0){
	  			body.forEach(function(location){
	  				location.category = formatCategory(location.category);
	  			});
	  		}
	  		renderSearchResultList(req, res, body);
  		}else{
  			console.error(body);
  			renderErrorPage(req, res, response.statusCode);
  		}
  	}
  });

};

exports.advanceSearch = function(req, res){
	res.status(200).json({
		message: 'good'
	});
};