
exports.renderErrorPage = function(req, res, statusCode){
  var title, content;
  if(statusCode === 404){
    title = '404 - Page Not Found';
    content = 'Sorry but the page you just required can\'t be found;'
  }else{
    title = statusCode + ' - Seems like something went wrong';
    content = 'We are sorry, but it looks like something, somewhere has gone just a little bit wrong';
  }
  res.status(statusCode);
  res.render('generic-text', {
    title: title,
    content: content
  });
};