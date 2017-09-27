/**
 * Created by Nick on 24.07.2017.
 */
let express = require('express'),
    router = express.Router(),
    config = require('../services/config'),
    auth = require('../services/auth'),
    user = require('../models/User');

//Authorization routes

router.get('/register',function(req,res,next){
    if(req.session && req.session.auth && req.session.auth.state)res.json({err:null,user:req.session.user});
    else res.render('auth', { appName: config.app.name,
        title: 'Sign Up',
        header: 'Sign Up:',
        userName: '',
        action:"register",
        sessionAuth:false});
});
router.post('/register', function(req,res) {
    if(req.session && req.session.auth && req.session.auth.state) res.json({err:null,user:req.session.user});
    else user.setUser(req.body, res, function(err,user){
        if(err) console.log('User '+ req.body.name +" don't registered. Error " + err);
        else console.log('User '+ user.name +' registered.');
        res.json({err:err,user:user})
    });
});
router.get('/login',function(req,res,next){
    res.render('auth', {appName: config.app.name,
        title: 'Login',
        header: 'Login:',
        userName: '',
        action:"login"});
});
router.post('/login', auth, function(req,res){
    console.log('User '+ req.session.user.name +' login.');
    res.json({err:null, user:req.session.user});
});
router.get('/logout', auth, function(req,res){
    if(req.session && req.session.auth)
    {
        console.log('User ' + req.session.user.name + ' logout.');
        req.session.auth = null;
        req.session.user = null;
    }
    res.render('index', { appName: config.app.name,
        cont: 'Db fbAuth',
        userName:"",
        sessionAuth:req.session.auth});
});


module.exports = router;