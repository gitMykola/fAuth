let express = require('express'),
    config = require('../services/config'),
    db = require('../services/db'),
    ETHAccounts = require('web3-eth-accounts'),
    user = require('../models/User');

module.exports = {
    createETHAccountWithPassword:function(req,res,next){
        if(!this.dataValidate(req.body)) {
            res.status(417);
            next(null);
        }else{
            try{
                let Accounts = new ETHAccounts(req.web3.currentProvider);
                let account = Accounts.create();
                let ethAccount = {};
                ethAccount.privateKey = account.privateKey;
                ethAccount.keyFile = Accounts.encrypt(ethAccount.privateKey,req.body.ps);
                next(ethAccount);
            }
            catch(err){
                res.status(503);
                next(null);
            }
        }
    },
    dataValidate:function(data){
        if(typeof data !== 'object') return false;
        else {
            for(let field in data)
                switch(field){
                    case 'ps':
                        return (typeof(data[field]) === 'string' && data[field].length > 7 && data[field].length < 51 && data[field].match(/[a-zA-Z0-9]/));
                        break;
                    default:
                        return false;
                }
        }
        return true;
    }
};