var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compass = require('node-compass');

var index = require('./routes/index');
var api = require('./routes/api_1_0');
//var users = require('./routes/users');

var app = express();

const { fork } = require('child_process');
/*
const refDB = fork('./services/refreshDB');//Don't forget set FULL PATH to PRODACTION!!!

refDB.on('message', (msg) => {
    console.log('Message from child DB ', msg.counter);
    global.data = msg.counter;
});

refDB.send('Start refresh DB.');
*/
const ref30 = fork('./services/refresh30Day');//Don't forget set FULL PATH to PRODACTION!!!
global.data30 = {'BTC-USD':['Starting...'],
                 'ETH-USD':['Starting...']};

ref30.on('message', (msg) => {
    console.log('Message from child 30Day');
    if(msg.start)global.data30 = {'BTC-USD':[], 'ETH-USD':[]};
    else{
        global.data30[msg.pair].push(msg.data);
        global.data30[msg.pair].sort(function(a, b){return parseInt(b.time) - parseInt(a.time)});
    }
});

ref30.send('Start refresh 30Day');


provider = new require('./providers/RatesProvider');

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
//app.use('/users', users);

//provider.getRatesToDB('BTC-USD');
//provider.marketsToDB();

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
