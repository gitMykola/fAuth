let express = require('express'),
    mongo = require('mongodb'),
    monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.host+':'+config.db.port+'/'+config.db.dbName),
    Personal = require('web3-eth-personal');

module.exports = {
    create:(web3, pass, next)=>{
        let personal = new Personal(web3.currentProvider);
        personal.newAccount(pass,(err,data)=>{
            if(err)next({address:err});
            else next({address:data});
        });
    },

};