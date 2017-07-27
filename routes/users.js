var express = require('express'),
    router = express.Router(),
    model = 'users',
    Auth = function(req, res, next) {
        if (req.headers.authorization && req.headers.authorization.search('Basic ') === 0) {
            // fetch login and password
            var strpw = req.headers.authorization.split(' ')[1].split(':');
            const reqEmail = strpw[0];
            const reqPwd = strpw[1];
            var collection = req.db.get('users');
            collection.findOne({'email':reqEmail},function(err,result){
                if(result !== null && reqPwd == result.pwd){
                    req.session.auth = true;
                    req.session.user = result;
                    next();
                    //return;
                }else{
                    console.log('Unable to authenticate user');
                    console.log(req.headers.authorization);
                    res.header('WWW-Authenticate', 'Basic realm="Restricted Area"');
                    res.send('Authentication required', 401);}
            });
        }else {
            if(!req.session.auth) {
                console.log('Unable to authenticate user');
                console.log(req.headers.authorization);
                res.header('WWW-Authenticate', 'Basic realm="Restricted Area"');
                if (req.headers.authorization) {
                    setTimeout(function () {
                        res.send('Authentication required', 401);
                    }, 2000);
                } else {
                    res.send('Authentication required', 401);
                }
            }else next();
        }
    };


/* GET users listing. */
router.get('/api/', Auth, function(req, res) {
    var collection = req.db.get(model);
    collection.find({},function(err,users){
      res.json(users);
    });
});
router.get('/api/:id', Auth, function(req, res) {
    var collection = req.db.get(model);
    var userId = req.params.id;
    collection.find({'_id':userId},function(err,user){
      res.json(user);
    });
});
router.post('/api/', function(req, res) {
    var collection = req.db.get(model);
    collection.insert(req.body,function(err,user){
        res.json(user);
    });
});
router.put('/api/:id', Auth, function(req, res) {
    var collection = req.db.get(model);
    var userId = req.params.id;
    collection.update({'_id': userId},req.body,function(err,user){
        res.json(user);
    });
});
router.delete('/api/:id', Auth, function(req, res) {
    var collection = req.db.get(model);
    var userId = req.params.id;
    collection.remove({'_id':userId},function(err){
        res.json(err);
    });
});

module.exports = router;
