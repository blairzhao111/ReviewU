var express = require('express'),
	router = express.Router(),
    //require controller modules
	ctrlLocation = require('../controllers/locations.js'),
	ctrlReview = require('../controllers/reviews.js'),
	ctrlAuth = require('../controllers/authentication.js');

/**
location api routing
Basic url pattern: .../api/locations(/:locationid)
**/

//read a list of location data back 
router.get('/locations', ctrlLocation.listByDistance);

//read a single instance of location by id
router.get('/locations/:locationid', ctrlLocation.findOneById);

//read all instances of location by name
router.get('/locations/name/:locationName', ctrlLocation.findByName);

//read all instances of location by rating
router.get('/locations/rating/:dir/:val', ctrlLocation.findByRating);

//read all instances of location by category
router.get('/locations/category/:locationCategory', ctrlLocation.findByCategory);

//create a new instance of location
router.post('/locations', ctrlLocation.createOne);

//update a single instance of location by id
router.put('/locations/:locationid', ctrlLocation.updateOneById);

//delete a single instance of location by id
router.delete('/locations/:locationid', ctrlLocation.deleteOneById);

//router.get('/locations/:locationid/addType', ctrlLocation.updateOneTypeBYId);

/**
review api routing
Basic url pattern: .../api/locations/:locationid/reviews(/:reviewid)
**/

//read a single instance of review by location id and review id
router.get('/locations/:locationid/reviews/:reviewid', ctrlReview.findOneById);

//create a new instance of review and attach it to main document when its location is valid
router.post('/locations/:locationid/reviews', ctrlReview.createOne);

//update a single instance of review by locationid and reviewid
router.put('/locations/:locationid/reviews/:reviewid', ctrlReview.updateOneById);

//delete a single instance of review by locationid and reviewid
router.delete('/locations/:locationid/reviews/:reviewid', ctrlReview.deleteOneById);

/**
authentication api routing
**/
//api for user login action
router.post('/login', ctrlAuth.login);

//api for user registration action
router.post('/register', ctrlAuth.register);

module.exports = router;