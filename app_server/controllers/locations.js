var request = require('request'),
    util = require('../util/util.js'),
    config = require('../config/config.js'),
    serverUrl = config.serverUrl;

    //process the distance data in locations
var formatDistance = util.formatDistance,
    //format category, capitalize first character
    formatCategory = util.formatCategory,
    //process the timestamp data in reviews to make it more readible.
    formatTimestamp = util.formatTimestamp;

//get a location object from db through Restful API and execute the callback function.
var getLocation = function(req, res, callback){
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
          callback(req, res, location);
        }else{
          renderErrorPage(req, res, response.statusCode);
        }
      }
  });   
};

//categorize return locations into different lists by their categories
var categoryList = function(locations){
  var result = {},
      rest = [],
      bar = [],
      shop = [],
      service = [],
      others = []; 

  if(!locations.length){return result;}

  locations.forEach(function(location){
    switch(location.category){
      case 'restaurant':
        rest.push(location);
        break;
      case 'bar':
        bar.push(location);
        break;
      case 'cafe':
        bar.push(location);
        break;
      case 'shopping':
        shop.push(location);
        break;
      case 'service':
        service.push(location);
        break;
      case 'others':
        others.push(location);
        break;
      default:
        others.push(location);
        break;
    }
  });

  result.restaurant = rest.length>0?rest:null;
  result.bar = bar.length>0?bar:null;
  result.shopping = shop.length>0?shop:null;
  result.service = service.length>0?service:null;
  result.others = others.length>0?others:null;

  return result;
};


/**
*  Render view function section
**/

//function for rendering any error page
var renderErrorPage = util.renderErrorPage;

//function for rendering homelist view
var renderListPage = function(req, res, locations){
  var message;
  if(!(locations instanceof Array)){
    message = 'API lookup error';
    locations = [];
  }
  locations = categoryList(locations);
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
      _id: location._id,
      name: location.name,
      address: location.address,
      category: location.category,
      rating: location.rating,
      facilities: location.facilities,
      coords: location.coords,
      openingTimes: location.openingTimes,
      reviews: location.reviews
    },
  });
};

//function for rendering the review form page for a specific location.
var renderReviewFormPage = function(req, res, location){
  var name = location.name,
      message = req.query.err?'Please fill in all required fields and try again!':null;
  res.render('location-review-form', {
    title: 'Review ' + name  + ' on ReviewU',
    pageHeader: { title: 'Review ' + name },
    locationid: location._id,
    message: message
  }); 
};


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
            lng: process.env.NODE_ENV==='production'?'-78.8148184':'-0.9692599',
            lat: process.env.NODE_ENV==='production'?'43.0056247':'51.378091',
            maxdis: req.query.maxdis || (process.env.NODE_ENV==='production'?null:'10'),
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
  getLocation(req, res, function(req, res, location){
    if(location.category){
      location.category = formatCategory(location.category);
    }
    renderDetailPage(req, res, location);
  });
};

/* Get 'Add Review' Page*/
module.exports.review = function (req, res) {
  getLocation(req, res, function(req, res, location){
    renderReviewFormPage(req, res, location);
  });
};

/* Add review to a specific location and return back to that location's detail page*/
module.exports.addReview = function(req, res){
    var body = req.body,
        locationid = req.params.locationid,
        path = '/api/locations/' + locationid + '/reviews',
        postData = {
          author: body.name,
          rating: body.rating,
          reviewText: body.review
        },
        requestOptions = {
          url: serverUrl + path,
          method: 'POST',
          json: postData
        };

    //do simple not undefined value in application level
    if(!postData.author || !postData.rating || !postData.reviewText){
      res.status(304);
      return res.redirect('/location/' + locationid + '/review/new?err=true');
    }

    //make api call to review-createOne
    request(requestOptions, function(err, response, body){
      if(err){
        console.error(err);
      }else{
        body = JSON.parse(body);
        if(response.statusCode === 201){
          res.status(304);
          res.redirect('/location/' + locationid);
        }else if(response.statusCode === 400 && body.name && body.name === "ValidationError"){
          res.status(304);
          res.redirect('/location/' + locationid + '/review/new?err=true');
        }else{
          console.error(body);
          renderErrorPage(req, res, response.statusCode);
        }
      }
    });
};