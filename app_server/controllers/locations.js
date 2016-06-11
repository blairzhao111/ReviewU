var request = require('request'),
    util = require('../util/util.js'),
    config = require('../config/config.js'),
    serverUrl = config.serverUrl;

//process the distance data in locations
var formatDistance = function(locations){
  if(!locations || locations.length === 0){return;}
  locations.forEach(function(location){
    var distance, unit,
        locationDistance = parseFloat(location.distance);
    if(locationDistance<1000){
      distance = parseInt(locationDistance, 10);
      unit = 'm';
    }else{
      distance = (locationDistance/1000).toFixed(1);
      unit = 'km';
    }
    location.distance = distance + unit;    
  });
  return locations;
};

//process the timestamp data in reviews to make it more readible.
var formatTimestamp = function(reviews){
  if(!reviews || reviews.length === 0){return;}
  reviews.forEach(function(review){
    var date = new Date(review.timestamp),
        monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
        day = date.getDate(),
        month = monthNames[date.getMonth()],
        year = date.getFullYear();
    review.timestamp = month + ' ' + day + ' ' + year;
  });
  return reviews;
};


/**
*  Render view function section
**/
//function for rendering homelist view
var renderListPage = function(req, res, locations){
  var message;
  if(!(locations instanceof Array)){
    message = 'API lookup error';
    locations = [];
  }else{
    if(!locations.length){
      message = 'No places found nearby!'
    }
  }
  res.render('location-list', { 
    title: 'ReviewU - Share your reviews with us and find others',
    pageHeader: {
      title: 'ReviewU',
      strapline: 'Review every place near you and Share your experience with others!'
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
    locations: locations,
    message: message || null
  });
};

//function for rendering the location detail page
var renderDetailPage = function(req, res, location){
  res.render('location-info', {
    title: 'ReviewU - ' + location.name,
    pageHeader: {title: location.name},
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave areview to help other people just like you.'
    },
    location: {
      name: location.name,
      address: location.address,
      rating: location.rating,
      facilities: location.facilities,
      coords: location.coords,
      openingTimes: location.openingTimes,
      reviews: location.reviews
    }
  });
};

//function for rendering any error page
var renderErrorPage = util.renderErrorPage;


/**
*  Export section
**/
/* Get 'Home' Page*/
module.exports.homelist = function (req, res) {
  var path = '/api/locations',
      requestOptions = {
          url: serverUrl + path,
          method: 'GET',
          json: {},
          qs: {
            lng: process.env.NODE_ENV==='development'?'-78.8148184':'-0.9692599',
            lat: process.env.NODE_ENV==='development'?'43.0056247':'51.378091',
            maxdis: req.query.maxdis || (process.env.NODE_ENV==='development'?null:'10'),
            num: req.query.num || null
          }
      };  

  request(requestOptions, function(err, response, body){
      if(err){
        console.log(err);
      }else{
        var locations;
        locations = JSON.parse(body);
        if(response.statusCode === 200 && locations.length){
          locations = formatDistance(locations); 
        }
        renderListPage(req, res, locations);
      }  
  });
};

/* Get 'LocationInfo' Page*/
module.exports.locationInfo = function (req, res) {
  var locationid = req.params.locationid,
      path = '/api/locations/' + locationid,
      requestOptions = {
        url: serverUrl + path,
        method: 'GET',
        json: {},
      };

  request(requestOptions, function(err, response, body){
      if(err){
        console.error(err);
      }else{
        var location;
        location = JSON.parse(body);
        if(response.statusCode === 200){
          location.coords = {
            lng: location.coords[0],
            lat: location.coords[1]
          };
          location.reviews = formatTimestamp(location.reviews);
          renderDetailPage(req, res, location);
        }else{
          renderErrorPage(req, res, response.statusCode);
        }
      }
  });  
};

/* Get 'Add Review' Page*/
module.exports.addReview = function (req, res) {
  res.render('location-review-form', {
    title: 'Review Starcups on Loc8r',
    pageHeader: { title: 'Review Starcups' } 
  });
};