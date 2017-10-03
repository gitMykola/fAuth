let express = require('express'),
    auth = require('../services/auth'),
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
    accounts.get(req.session.user._id+'', (data)=>{
        console.dir(data);
        res.render('accounts', {
            appName: config.app.name,
            userName: req.session.user.name,
            sessionAuth: req.session.auth.state,
            acc:data
        });
    });
});
router.get('/accounts/ETH/txcount/:address',auth,(req,res)=>{
    accounts.getTransactions(req.web3, {currency:'ETH',address:req.params.address},(count)=>{
        res.json({count:count});
    });
});
router.get('/accounts/:userId',auth,(req,res)=>{
    accounts.get(req.params.userId, (data)=>{
        //console.dir(data);
        res.json(data);
    });
});
router.get('/test',(req,res)=>{
    res.json({data:'OK'});
    /*let af = 0;
    let bf = [{address:'0x56cb9adff6b442697b2eb912a73a618a5b3bea8a'},
        {address:'0x8ae4f5a1f71b52ccedcaa6df3c17dd4a5341ab7d'},
        {address:'30xde05cD644e6525e91260B6E24D489b7bFb9bFaFad'}];
    let cf = (ac,bc,rc,fc)=>{
        console.dir(bc);
        //ac++;
        fc(ac,bc,rc,cf);
    };
    console.log(typeof(cf));
    //fn(af,bf,res,cf);
    ftx(af,bf,req.web3,res,cf);*/
});
let ftx=(a,b,w3,r,c)=>{
    //let w3 = rq.web3;
    let fnt = ftx;
    if(a<b.length){
        w3.eth.getTransactionCount(b[a].address,(err,cnt)=>{
            b[a].txc = cnt;
            console.log('a = '+a+' len '+b.length+' cnt '+cnt);
            a++;
            fnt(a,b,w3,r,c);
        });
    }else r.json(b);
};
let fn=(a,b,r,c)=>{
    //a++;
    if(a < b.length){
        b[a].value = a*a;
        console.log('a = '+a+' len '+b.length+' type '+typeof(c));
        a++;
        fn(a,b,r,fn);
    }
    else r.json(b);
};


/*
* @method API Account::create
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
                    userId:req.session.user._id.toString(),
                    pass:body.passfrase};
        accounts.create(data,data=>{
            res.json(data);
        });
    }else res.json({err:'WRONG PASSFRASE!!!'});
});
module.exports = router;
