let express = require('express'),
    mongo = require('mongodb'),
    monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.host+':'+config.db.port+'/'+config.db.dbName),
    Web3 = require('web3');

module.exports = {
    create:(web3, next)=>{

        next({address:'12345678-ETH-ACCOUNT-ADDRESS', passfrase:'secret'});
    },

};