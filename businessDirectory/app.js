var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//add database packages
var mongoose= require('mongoose');
// add passport packages
var passport= require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var localStrategy= require('passport-local');

var routes = require('./routes/index');
var users = require('./routes/users');
var auth= require('./routes/auth');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//enable flash for messages
app.use(flash());

//passport config settings
app.use(session({
  secret: 'I will sometimes sing Katy Perry when I know I am alone',
  resave: true,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//access the users model
var User = require('./models/users');
passport.use(User.createStrategy());
passport.use(new localStrategy(User.authenticate()));

//serialize and deserialize users
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', routes, auth);
app.use('/users', users);
// app.use('/auth', auth);

//db connection
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Database Error: '));

db.once('open', function(callback){
  console.log('Connected to database');
});

//read mongo connection
var configDB = require('./config/db.js');
mongoose.connect(configDB.url)

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
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
