
/* Get 'Home' Page*/
module.exports.homelist = function (req, res) {
  res.render('location-list', { 
  	title: 'Loc8r - find a place to work with wifi',
  	pageHeader: {
  		title: 'Loc8r',
  		strapline: 'Find places to work with wifi near you!'
  	},
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
  	locations: [{
  		name: 'Starcups',
  		address: '125 High Street, Reading, RG6 1PS',
  		rating: 3,
  		distance: '100m',
  		facilities: ['Hot drinks', 'Food', 'Premium wifi']
  	}, {
  		name: 'Cafe Hero',
  		address: '125 High Street, Reading, RG6 1PS',
  		rating: 4,
  		distance: '150m',
  		facilities: ['Beer', 'Food', 'Premium wifi']
  	}, {
  		name: 'Burger Queen',
  		address: '125 High Street, Reading, RG6 1PS',
  		rating: 4,
  		distance: '230m',
  		facilities: ['Burger', 'Food', 'Premium wifi']
  	}, {
  		name: 'Pizza Feast',
  		address: '125 High Street, Reading, RG6 1PS',
  		rating: 5,
  		distance: '300m',
  		facilities: ['Pizza', 'Food', 'Premium wifi']
  	}, {
   		name: 'Grill Heaven',
  		address: '125 High Street, Reading, RG6 1PS',
  		rating: 4,
  		distance: '350m',
  		facilities: ['Grill', 'Drinks', 'Premium wifi']
  	}]
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