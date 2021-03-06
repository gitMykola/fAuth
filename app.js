let express = require('express'),
    path = require('path'),
    config = require(__dirname + '/services/config'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    cors = require('cors'),
    bodyParser = require('body-parser');

let auth = require(__dirname + '/routes/auth'),
    index = require(__dirname + '/routes/index'),
    users = require(__dirname + '/routes/user'),
    session = require('express-session'),
    mongoStore = require('connect-mongodb-session')(session),
    connectionString = 'mongodb://' //+ config.db.user + ':'
                                    //+ config.db.pwd + '@'
                                    + config.db.url,
    store = new mongoStore({
        uri: connectionString,
        collection: 'sessions'
    }),
    Web3 = require('web3'),
    api = require(__dirname + '/routes/api_1_0'),
    api4 = require(__dirname + '/routes/api_4_0'),
    api3 = require(__dirname + '/routes/api_3_0');

let app = express(),
    startProcess = require(__dirname + '/services/start');

    global.appPath = __dirname;
    global.config = require(__dirname + '/services/config');

    store.on('error', function(error) {console.log(error)});

// view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(session({
        store:store,
        cookie:{maxAge: config.app.cookieLife},
        secret: config.app.privateKey,
        resave: true,
        saveUninitialized: true
    }));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(function(req,res,next){//console.dir(req.headers['content-length']);
    //console.log('Request size '+req.socket.bytesRead);
    if(req.headers['content-length']
        && Number (req.headers['content-length']) > config.app.maxContentSize
        || req.socket.bytesRead > config.app.maxContentSize)
    {
        res.status(301);
        res.json({});
    }
    if (typeof req.web3 !== 'undefined') {
        req.web3 = new Web3(web3.currentProvider);
    } else {
        // set the provider you want from Web3.providers
        req.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    if(!req.web3.isConnected())
        console.log("not connected");
    else
        console.log("connected");
    next();

    });


/*
let oauth2          = require('./services/oauth2'),
    passport            = require('passport');

app.use(passport.initialize());

require('./services/oauth');

app.post('/oauth/token', oauth2.token);

app.get('/api/userInfo',
    passport.authenticate('bearer', { session: false }),
    function(req, res) {
        // req.authInfo is set using the `info` argument supplied by
        // `BearerStrategy`.  It is typically used to indicate scope of the token,
        // and used in access control checks.  For illustrative purposes, this
        // example simply returns the scope in the response.
        res.json({ user_id: req.user.userId, name: req.user.username, scope: req.authInfo.scope })
    }
);



    app.use('/gmail', (req,res)=>{
        res.render('googleAuth');
    });*/
      app.get('/',(req,res)=>{
          res.json(config.routes);
      });
      app.use('/api/v3.0', api3);
      app.use('/api/v1.0', api);
      app.use('/api/v4.0', api4);
//    app.use('/auth',auth);
//    app.use('/users', users);




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
      //console.dir(err);
      res.json({error:'error'});
    });

// Starting database & global object data refreshing process

   startProcess({ref30DB:config.app.ref30DB});

module.exports = app;
