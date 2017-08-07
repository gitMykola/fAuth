var express = require('express'),
    config = require('../service/config'),
    router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var name = "";
  if(req.session && req.session.user)name = req.session.user.name;
  res.render('index', { appName: config.app.name , userName:name, sessionAuth:req.session.auth});
});

module.exports = router;
