
var express = require('express'),
    router = express.Router(),
	//load controller modules
    ctrlLocation = require('../controllers/locations.js'),
    ctrlOthers = require('../controllers/others.js'),
    ctrlSearch = require('../controllers/search.js');


/* Locations pages. */
router.get('/', ctrlLocation.homelist);
router.get('/location/:locationid', ctrlLocation.locationInfo);
router.get('/location/:locationid/review/new', ctrlLocation.review);
router.post('/location/:locationid/review/new', ctrlLocation.addReview);

/* Others pages. */
router.get('/about', ctrlOthers.about);

/* Search router */
router.get('/search', ctrlSearch.searchByName);
router.get('/search/adv', ctrlSearch.advanceSearch);

module.exports = router;
