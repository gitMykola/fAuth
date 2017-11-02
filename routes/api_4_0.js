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
module.exports = router;