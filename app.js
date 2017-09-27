let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let compass = require('node-compass');

let auth = require('./routes/auth'),
    index = require('./routes/index'),
    users = require('./routes/user'),
    api = require('./routes/api_1_0');

let app = express();
let startProcess = require('./services/start');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compass({ mode: 'expanded' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/v1.0', api);
app.use('/auth',auth);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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

// Starting database & global object data refreshing process

startProcess();

module.exports = app;
