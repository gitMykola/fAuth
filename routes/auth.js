/**
 * Created by Nick on 24.07.2017.
 */
    var express = require('express'),
    router = express.Router(),
    auth = require('../service/auth');

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
router.post('/logout', auth, function(req,res){
    console.log('User '+ req.session.user.name +' logout.');
    req.session.auth = false;
    req.session.user = null;
    res.redirect('/');
});

router.post('/api', auth, function(req,res){
    console.log('API user '+ req.session.user.name +' login.');
    res.json(req.session.user);
});
router.post('/api/logout', auth, function(req,res){
    console.log('API user '+ req.session.user.name +' logout.');
    req.session.auth = false;
    req.session.user = null;
    res.send({'msg':'logout ok'});
});
module.exports = router;