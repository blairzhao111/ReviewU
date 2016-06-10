var request = require('request'),
    apiOptions = {
      server: 'http://localhost:3000'
    };

if(process.env.NODE_ENV === 'production'){
  apiOptions.server = '';
}

//process the distance data in 
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
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
    locations: locations,
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
          url: apiOptions.server + path,
          method: 'GET',
          json: {},
          qs: {
            lng: req.query.lng || '-78.8148184',
            lat: req.query.lat || '43.0056247',
            maxdis: req.query.maxdis || null,
            num: req.query.num || null
          }
      };  

  request(requestOptions, function(err, response, body){
      if(err){
        console.log(err);
      }else if(response.statusCode !== 200){
        console.log(response.statusCode);
      }else{
        var locations;
        locations = JSON.parse(body);
        if(locations.length){
          locations = formatDistance(locations); 
        }
        renderListPage(req, res, locations);
      }  
  });
};

/* Get 'LocationInfo' Page*/
module.exports.locationInfo = function (req, res) {
  res.render('location-info', {
    title: 'Starcups',
    pageHeader: {title: 'Starcups'},
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave areview to help other people just like you.'
    },
    location: {
      name: 'Starcups',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 3,
      facilities: ['Hot drinks', 'Food', 'Premium wifi'],
      coords: {lat: 51.455041, lng: -0.9690884},
      openingTimes: [{
        days: 'Monday - Friday',
        opening: '7:00am',
        closing: '7:00pm',
        closed: false
      },{
        days: 'Saturday',
        opening: '8:00am',
        closing: '5:00pm',
        closed: false
      },{
        days: 'Sunday',
        closed: true
      }],
      reviews: [{
        author: 'Junwei Zhao',
        rating: 5,
        timestamp: '02 June 2016',
        reviewText: 'What a great place. This place is nice!!!'
      }, {
        author: 'Funny Guy',
        rating: 4,
        timestamp: '01 June 2016',
        reviewText: 'I think this place is okay to hang out with your friend!'
      }, {
        author: 'someone else',
        rating: 3,
        timestamp: '30 May 2016',
        reviewText: 'This cafe is nothing but ordinary, nothing special.'
      }]
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