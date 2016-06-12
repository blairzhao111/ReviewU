
var express = require('express');
var router = express.Router();
//load controller modules
var ctrlLocation = require('../controllers/locations.js');
var ctrlOthers = require('../controllers/others.js');

/* Locations pages. */
router.get('/', ctrlLocation.homelist);
router.get('/location/:locationid', ctrlLocation.locationInfo);
router.get('/location/:locationid/review/new', ctrlLocation.review);
router.post('/location/:locationid/review/new', ctrlLocation.addReview);

/* Others pages. */
router.get('/about', ctrlOthers.about);

module.exports = router;
