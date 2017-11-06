let express = require('express'),
    config = require('../services/config'),
    db = require('../services/db'),
    ETHAccounts = require('web3-eth-accounts'),
    Tx = require('ethereumjs-tx'),
    user = require('../models/User');

module.exports = {
    createETHAccountWithPassword:function(req,res,next){
        if(!this.dataValidate(req.body) || !req.body.ps) {
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
                console.log(err);
                res.status(503);
                next(null);
            }
        }
    },
    sendRawTransaction:function(req,res,next){
        if(!this.dataValidate(req.params) || !req.params.hs){
            res.status(417);
            next(null);
        }else{
            try{
                req.web3.sendSignedTransaction(req.params.hs)
                    .then(hash=>next({tx:hash}));
            }catch(err){
                console.log(err);
                res.status(503);
                next(null);
            }
        }
    },
    getBalance:function(req,res,next){
        if(!this.dataValidate(req.params) || !req.params.ad){
            res.status(417);
            next(null);
        }else{
            try{
                req.web3.eth.getBalance(req.params.ad)
                    .then(balance=>next({bc:balance}));
            }catch(err){
                console.log(err);
                res.status(503);
                next(null);
            }
        }
    },
    getTransactionByHash:function(req,res,next){
        if(!this.dataValidate(req.params) || !req.params.hs){
            res.status(417);
            next(null);
        }else{
            try{
                req.web3.eth.getTransactions(req.params.hs,tx=>next(tx))
            }catch(err){
                console.log(err);
                res.status(503);
                next(null);
            }
        }
    },
    getTransactionsList:function(req,res,next){

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