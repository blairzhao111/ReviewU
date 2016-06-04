
/* Get About Page*/
module.exports.about = function (req, res) {
  res.render('generic-text', { title: 'About' });
};