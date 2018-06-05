var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const fileUpload = require('express-fileupload');

var express = require('express');

var indexRouter = require('./routes/index');

// Test
var uploadRouter = require('./routes/upload');

var composerRouter = require('./routes/composer');
var meRouter = require('./routes/me');
var producerRouter = require('./routes/producer');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// views
app.use('/', indexRouter);

// Little Test
app.use('/upload', uploadRouter);

app.use('/composer', composerRouter);
app.use('/producer', producerRouter);
app.use('/me', meRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
