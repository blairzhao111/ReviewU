var express = require('express');
var router = express.Router();
//load controller modules
var ctrlLocation = require('../controllers/locations.js');
var ctrlOthers = require('../controllers/others.js');

/* Locations pages. */
router.get('/', ctrlLocation.homelist);
router.get('/location', ctrlLocation.locationInfo);
router.get('/location/review/new', ctrlLocation.addReview);

/* Others pages. */
router.get('/about', ctrlOthers.about);

module.exports = router;
