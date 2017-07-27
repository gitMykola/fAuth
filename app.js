var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    lessMiddleware = require('less-middleware'),
    session = require('express-session'),
    cors = require('cors'),
    mongo = require('mongodb'),
    monk = require('monk'),
    db = monk('localhost:27017/doit'),

    auth = require('./routes/auth'),
    index = require('./routes/index'),
    users = require('./routes/users'),
    markers = require('./routes/markers'),


    app = express();
debugger;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(function(req,res,next){
    req.db = db;
    /*req.auth = function(req, res, next) {
        if (req.headers.authorization && req.headers.authorization.search('Basic ') === 0) {
            // fetch login and password
            var strpw = req.headers.authorization.split(' ')[1].split(':');
            const reqEmail = strpw[0];
            const reqPwd = strpw[1];
            console.log(reqEmail);
            console.log(reqPwd);
            var collection = db.get('users');
            collection.find({'email':reqEmail},function(err,result){
                if(result.length && reqPwd == result[0].pwd){
                    req.session.auth = true;
                    req.session.user = result[0];
                    next();
                    //return;
                }
            });
        }else {
            if(!req.session.auth) {
                console.log('Unable to authenticate user');
                console.log(req.headers.authorization);
                res.header('WWW-Authenticate', 'Basic realm="Restricted Area"');
                if (req.headers.authorization) {
                    setTimeout(function () {
                        res.send('Authentication required', 401);
                    }, 5000);
                } else {
                    res.send('Authentication required', 401);
                }
            }else next();
        }
    };*/
    next();
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
/*app.use(function(req,res,next){
    if (req.session.auth || req.path === '/auth/login' || req.path === '/auth/register' || req.path === '/') {
        next();
    } else {
        res.redirect("/");
    }
});*/
app.use('/', index);
app.use('/auth', auth);
app.use('/users', users);
app.use('/markers', markers);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
debugger;
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
