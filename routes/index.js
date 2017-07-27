var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var name = (req.session && req.session.user !== undefined)?req.session.user.name:"";
  res.render('index', { title: 'Express' , cont: 'Db test', userName:name, sessionAuth:req.session.auth});
});

module.exports = router;
