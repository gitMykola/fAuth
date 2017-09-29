let express = require('express'),
    auth = require('../services/auth'),
    //provider = new require('../providers/RatesProvider'),
    //accounts = require('../providers/EthereumProvider'),
    accounts = require('../models/Account'),
    config = require('../services/config'),
    router = express.Router();

router.get('/',(req,res)=>{
    res.render('index', {
        appName: config.app.name,
        userName: req.session.user.name,
        sessionAuth: req.session.auth.state
    });
});
/* GET rates. */
router.get('/stat/:pair', function(req, res) {
    let pair = req.params.pair;
    let data = global.data30[pair];
            res.json((data && data.length) ? data
                : {error: 'No ' + pair + ' data.'});
});
/* Accounts
 get request to accounts(index.jade) state of accounts
*/
router.get('/accounts',auth,(req,res)=>{
    accounts.get(req, (data)=>{
        console.dir(data);
        res.render('accounts', {
            appName: config.app.name,
            userName: req.session.user.name,
            sessionAuth: req.session.auth.state,
            acc:data
        });
    });
});
/*
* @method API create account
* @params (
*           web3 instance,
*           passfrase String,
*           callback func()
* )
* @return {String} Account address || err
*/
router.post('/accounts/create',auth, (req, res)=>{
    let body = req.body;
    console.dir(req.body);
    if(body.passfrase.length === 10) {
        let data = {web3:req.web3,
                    userId:req.session.user._id,
                    pass:body.passfrase};
        accounts.create(data,data=>{
            res.json(data);
        });
    }else res.json({err:'WRONG PASSFRASE!!!'});
});
module.exports = router;
