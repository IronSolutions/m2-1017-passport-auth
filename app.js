var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require("express-session");
var expressLayouts = require('express-ejs-layouts');
const debug = require('debug')(`m2-1017-passport-auth:${path.basename(__filename).split('.')[0]}`);
const mongoose = require("mongoose");
const flash = require("connect-flash");

var index = require('./routes/index');
var auth = require('./routes/auth');
var authGoogle = require('./routes/authGoogle');

var app = express();

const dbURL = "mongodb://localhost/passport-local";
mongoose.connect(dbURL).then(() => {
  debug(`Connected to DB: ${dbURL}`);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout','main-layout');
app.use(expressLayouts);

// app.js
app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
require('./passport')(app);

app.use((req,res,next) => {
  res.locals.title = "Default title";
  res.locals.user = req.user;
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/auth', auth);
app.use('/auth', authGoogle);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
