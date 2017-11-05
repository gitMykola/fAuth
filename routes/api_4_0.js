let express = require('express'),
    ETHAccounts = require('../models/ETHAccount'),
    router = express.Router();

/*****************************************************************
*               ETH ACCOUNT CREATE
* ****************************************************************/
router.post('/ETH/createAccount',(req,res)=>{
    ETHAccounts.createETHAccountWithPassword(req,res,(data)=>{
        res.json(data);
    })
});
router.get('/ETH/balance/:address',(req,res)=>{});
router.get('/ETH/transactionsList/:address',(req,res)=>{});
router.get('/ETH/transactionByHash/:hash',(req,res)=>{});
router.get('/ETH/sendRawTransaction/:hex',(req,res)=>{});
module.exports = router;