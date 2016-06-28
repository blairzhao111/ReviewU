//************************
//Application Dependency
//************************
require('dotenv').load(); //load environment variables
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

//*****************************
//application setup and config
//*****************************
//require mongodb config and connection file for application
require('./app_api/models/db.js');
//require passport config  for application
require('./app_api/config/passport.js');
var routes = require('./app_server/routes/index.js'),
    routesApi = require('./app_api/routes/index.js'),
    util = require('./app_server/util/util.js');

//create application
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

//**************
//middelwares
//**************
app.use(favicon(path.join(__dirname, '/public/images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: 'A secret is a secret for sure',
	resave: true,
	saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

//custom middleware for custom error flash message handling
app.use(function(req, res, next){
  res.locals.error = req.session.error;
  delete req.session.error;
  next();
});

//**************
//defining routing
//**************
app.use('/', routes);
app.use('/api', routesApi);


//****************
//error handlers
//****************
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Catch unauthorized errors
app.use(function(err, req, res, next){
  if(err.name==='UnauthorizedError'){
    res.status(401);
    res.json({
      message: err.name + ':' + err.message
    });
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    util.renderErrorPage(req, res, err.status || 500);
    console.error(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  util.renderErrorPage(req, res, err.status || 500);
});

module.exports = app;
