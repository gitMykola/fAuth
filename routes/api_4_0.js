let express = require('express'),
    ETHAccounts = require('../models/ETHAccount'),
    router = express.Router();

/*****************************************************************
*               ETH ACCOUNT CREATE
* ****************************************************************/
router.post('/ETH/createAccount',(req,res)=>{
    ETHAccounts.createETHAccountWithPassword(req,res,(data)=>{
        res.json(data)
    })
});
router.get('/ETH/getBalance/:address',(req,res)=>{
    ETHAccounts.getBalance(req,res,balance=>{
        res.json(balance)
    })
});
router.get('/ETH/getTransactionsList/:address',(req,res)=>{});
router.get('/ETH/getTransactionByHash/:hash',(req,res)=>{
    ETHAccounts.getTransactionByHash(req,res,tx=>{
        res.json(tx)
    })
});
router.get('/ETH/sendRawTransaction/:hex',(req,res)=>{
    ETHAccounts.sendRawTransaction(req,res,tx=>{
        res.json(tx)
    })
});
module.exports = router;