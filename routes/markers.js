var express = require('express'),
    router = express.Router(),
    model = 'markers'
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
router.get('/api/:id', Auth, function(req, res) {
    var collection = req.db.get(model);
    collection.find({'author': req.params.id},function(err,markers){
        res.json(markers);
    });
});
router.post('/api', Auth, function(req, res) {
    var collection = req.db.get(model);
    console.dir(req.body);
    collection.findOne({'author': req.body.author},function(err,result) {
        if (result !== null && result._id !== undefined)
        {
            //req.body._id = result._id;
            console.log(req.body);
            collection.update({'_id': result._id},req.body,eFunk);
        }else collection.insert(req.body,eFunk);
        res.json({ok:"It's ok!"});
    });
});
router.get('/api', function(req, res) {
    var collection = req.db.get(model);
    console.log(req.body);
    //collection.insert(req.body,function(err,user){res.json(user);});
    res.json({ok:'ok'});
});
router.delete('/api/:id', Auth, function(req, res) {
    var collection = req.db.get(model);
    var authorId = req.params.id;
    collection.remove({author: authorId},eFunk);
    res.json({ok:"It's ok!"});
});
eFunk = function(err){console.log(err);}

module.exports = router;