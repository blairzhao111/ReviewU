require('dotenv').load(); //load environment variables
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//require mongodb config and connection file.
require('./app_api/models/db.js');

var routes = require('./app_server/routes/index.js');
var routesApi = require('./app_api/routes/index.js');
var util = require('./app_server/util/util.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

//middelwares
app.use(favicon(path.join(__dirname, '/public/images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: 'A secret is a secret for sure',
	resave: false,
	saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));


//defining routing
app.use('/', routes);
app.use('/api', routesApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

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
