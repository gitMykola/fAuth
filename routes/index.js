let express = require('express'),
    config = require('../service/config'),
    router = express.Router(),
    btc = new require('../models/Btc'),
    eth = new require('../models/Eth');

/* GET home page. */
router.get('/', function(req, res, next) {
  let auth = false,name = "";
  if(req.session && req.session.user)name = req.session.user.name;
  if(req.session.auth && req.session.auth.state)auth = true;
  res.render('index', { appName: config.app.name , userName:name, sessionAuth:auth});
});
router.get('/eth/:period', function(req,res){
  eth.getHystory(req.params.period,res);
});
router.get('/btc/:period', function(req,res){
    btc.getHystory(req.params.period,res);
});

module.exports = router;
