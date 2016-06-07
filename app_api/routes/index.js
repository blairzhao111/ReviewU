var express = require('express');
var router = express.Router();
//require location controller module
var ctrlLocation = require('../controllers/locations.js');
var ctrlReview = require('../controllers/reviews.js');

/**
location api routing
**/
//read a list of location data back 
router.get('/locations', ctrlLocation.listByDistance);

//create a new instance of location
router.post('/locations', ctrlLocation.create);

//read a single instance of location by id
router.get('/locations/:locationid', ctrlLocation.findOneById);

//update a single instance of location by id
router.put('/locations/:locationid', ctrlLocation.updateOneById);

//delete a single instance of location by id
router.delete('/locations/:locationid', ctrlLocation.deleteOneById);


/**
review api routing
**/
//read a single instance of review by location id and review id
router.get('/locations/:locationid/reviews/:reviewid', ctrlReview.findOneById);


module.exports = router;