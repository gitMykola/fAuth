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
router.get('/:pair', function(req, res) {
    let param = req.params.pair;
    console.log(param);
    switch(param) {
        case('createAccount'): {
            auth(req,res,()=>{
                res.render('index', {
                    appName: config.app.name,
                    userName: req.session.user.name,
                    sessionAuth: req.session.auth.state
                });
            });
            break;
        }
        default: {
            let data = global.data30[param];
            res.json((data && data.length) ? data
                : {error: 'No ' + req.params.pair + ' data.'});
        }
    }
});
/* Accounts
* @method API createAccount
* @params req.body{id:String(MongoDB),
*                  passfrase:String(8..16),
*                  currency:String(3)}
* @return {String} Account address
*/
router.post('/createAccount',auth, (req, res)=>{
    let body = req.body;
    console.dir(req.body);
    if(body.passfrase.length === 10) accounts.create(req.web3, body.passfrase,data=>{
       res.json(data);
    });else res.json({err:'WRONG PASSFRASE!!!'});
});
module.exports = router;
