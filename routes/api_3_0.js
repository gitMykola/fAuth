let express = require('express'),
    config = require('../services/config'),
    User = require('../models/User'),
    Accounts = require('../models/Account'),
    md5 = require('js-md5'),
    url = require('url'),
    rnd = require('randomstring'),
    router = express.Router(),
    Auth = require('../services/jwtAuth');
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
    Auth.jwtAuthorization(req,res,(auth)=>{
        if(auth.token){
            res.setHeader('WWW-Authenticate',auth.token);
            res.json({rp:null});
        }else res.json({rp:auth.auth});

    })
});

/**********************************************************
*                   Restricted area endpoints
* ********************************************************/

router.post('/googletoken',Auth.jwtAuthentication,(req,res)=>{
    if(req.auth) Auth.googleTokenVerify(req,res,(gauth)=>{
                    if(gauth) res.json({rg:null});
                    else res.json({rg:0});
                });
    else if(!req.texp)res.json({rt:0});
                else res.json({rt:1});
});
/*
* Transactions
*
* send
*   @body{
*           to:,    user-reciever
*           am:,    amount in wie
*           p001:,  password
*           }
*   @cur:   transaction currency   ETH,BTC and etc.
* */
router.post('/send/:cur',Auth.jwtAuthentication,(req,res)=>{
    if(req.auth)
        switch(req.params.cur){
            case 'ETH':
                Accounts.sendEthTx(req,res,hash=>{
                    res.json({rx:hash});
                });
                break;
            default:
                res.json({rx:0});
                break;
        }
    else if (!req.texp) res.json({rt:0});
                    else res.json({rt:1});
});
/*
* Count transactions
* */
router.get('/countTx/:cur',Auth.jwtAuthentication,()=>{});
/*
* Account balance
* */
router.get('/balance/:cur',()=>{});
/*
* Contacts
*
* @body{
*           cs:[c1,c2,...,c50]
*       }
* */
router.post('/contacts',Auth.jwtAuthentication,(req,res)=>{
    if(req.auth) Accounts.checkContacts(req,res,(cs)=>{
        res.json(cs);
    });
    else if(!req.texp)res.json({rt:0});
    else res.json({rt:1});
});

module.exports = router;