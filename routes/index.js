var express = require('express'),
    config = require('../service/config'),
    router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var auth = false,name = "";
  if(req.session && req.session.user)name = req.session.user.name;
  if(req.session.auth && req.session.auth.state)auth = true;
  res.render('index', { appName: config.app.name , userName:name, sessionAuth:auth});
});

module.exports = router;
