/**
 * Created by Nick on 24.07.2017.
 */
    var express = require('express');
    router = express.Router(),
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
            if(req.session.auth == false) {
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

//Authorization routes


router.get('/register',function(req,res,next){
    if(!req.session.auth)res.render('auth', { title: 'Sign Up', header: 'Sign Up:', action:"register", sessionAuth:req.session.auth});
    else res.redirect('/');
});
router.post('/register',function(req,res) {
    if(!req.session.auth) {
        var collection = db.get('users');
        var user = collection.find({email: req.body.email});
        if (user._id == undefined) {
            collection.insert(req.body, function (err, result) {
                if (result.length) {
                    req.session.user = result[0];
                    req.session.auth = true;
                    res.redirect('/');
                }
                var msg = (err === null) ? req.body.name + ' sined Up!' : 'Error: ' + err;
                res.render('auth', {header: msg, sessionAuth: req.session.auth});
            });
        } else {
            res.render('auth', {header: "User email: " + req.body.email + " exist! Try another one." + user.toString()});
        }
    }else res.redirect('/');
});
router.get('/login',function(req,res,next){
    if(!req.session.auth)res.render('auth', { title: 'Enter', header: 'Enter:', action:"login"});
    else res.redirect('/');
});
router.post('/logout', Auth, function(req,res){
    console.log('User '+ req.session.user.name +' logout.');
    req.session.auth = false;
    req.session.user = null;
    res.redirect('/');
});

router.post('/api', Auth, function(req,res){
    console.log('API user '+ req.session.user.name +' login.');
    res.json(req.session.user);
});
router.post('/api/logout', Auth, function(req,res){
    console.log('API user '+ req.session.user.name +' logout.');
    req.session.auth = false;
    req.session.user = null;
    res.send({'msg':'logout ok'});
});
module.exports = router;