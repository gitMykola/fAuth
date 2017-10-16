let express = require('express'),
    config = require('../services/config'),
    User = require('../models/User'),
    Accounts = require('../models/Account'),
    md5 = require('js-md5'),
    url = require('url'),
    rnd = require('randomstring'),
    router = express.Router(),
    jwtAuth = require('../services/jwtAuth');
/*
* @body:{
*           pn: +380931311333
                  (PhoneNumber),
            on: 1,
            h1: 144.11.3.12
                    (IP),
            p3: 8679300256755
                    IMEI,
            ul: ru en (etc),
*       }
* */
router.post('/phonevalid',(req,res)=>{
    User.setTempPhoneUser(req,res,(data)=>{
        res.json(data);
    })
});
/*
* OEIww
* 59e22584159fe127acf1a8e7
* md5() = b870da30902ff5c9a433c19aab2cfc32
*         b870da30902ff5c9a433c19aab2cfc32
*
* @body:{
*           ph: -
*           ss: -
*           s:  -
*        }
*
* */
router.post('/smsconfirm',(req,res)=>{
    User.sendSmsConfirmation(req,res,(data)=>{
        res.json(data);
    })
});
/*
* @body:{
*           p001: - b870da30,
*           sp: - ,
*       }
*
* */
router.post('/password',(req,res)=>{
    Accounts.createAccountsViaPassword(req,res,(data)=>{
        res.json(data);
    })
});
/*
* JWT authorization
* */
router.post('/auth',(req,res)=>{
    jwtAuth(req,res,(auth)=>{
        if(auth.token){
            res.setHeader('WWW-Authenticate',auth.token);
            res.json({rp:null});
        }else res.json({rp:auth.auth});

    })
});
router.post('/oauth2',(req,res)=>{});

module.exports = router;