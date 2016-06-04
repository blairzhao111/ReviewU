
/* Get 'Home' Page*/
module.exports.homelist = function (req, res) {
  res.render('location-list', { title: 'Home' });
};

/* Get 'LocationInfo' Page*/
module.exports.locationInfo = function (req, res) {
  res.render('location-info', { title: 'Location info' });
};

/* Get 'Add Review' Page*/
module.exports.addReview = function (req, res) {
  res.render('location-review-form', { title: 'Add Review' });
};