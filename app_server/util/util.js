//render any error pages
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
    user: req.session.account?req.session.account.user:null,
    title: title,
    content: content
  });
};

//format category, capitalize first character
exports.formatCategory = function(category){
  if(!category){return category;}
  console.log(category.charAt(0).toUpperCase());
  return category.charAt(0).toUpperCase() + category.substr(1);
};

//process the distance data in locations
exports.formatDistance = function(locations){
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

//process the timestamp data in reviews to make it more readible.
exports.formatTimestamp = function(reviews){
  if(!reviews || reviews.length === 0){return;}
  reviews.forEach(function(review){
    var date = new Date(review.timestamp),
        monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
        day = date.getDate(),
        month = monthNames[date.getMonth()],
        year = date.getFullYear();
    review.timestamp = month + ' ' + day + ' ' + year;
  });
  return reviews;
};

exports.getSidebarByCategory = function(category){
  var result;

  switch(category){
    case 'Restaurant':
      result = "it's a restaurant that provides various food choices!";
      break;
    case 'Bar':
      result = "it's a good choice for hanging out with your friends!";
      break;
    case 'Cafe':
      result = "it's a nice place to just chill with cups of coffee!";
      break;
    case 'Shopping':
      result = "it might sell somethings that you may want to buy! ";
      break;
    case 'Service':
      result = "it provides you the service that you may need!";
      break;
    default:
      result = "it will help you when you need it!";
  }

  return result
};

exports.cachePrevUrl = function(req){
  req.session.returnTo = req.url;
  return;
};