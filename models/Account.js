let express = require('express'),
    mongo = require('mongodb'),
    monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.host+':'+config.db.port+'/'+config.db.dbName),
    Personal = require('web3-eth-personal'),
    user = require('../models/User');

module.exports = {
    create:(data, next, id = data.userId)=>{
        let personal = new Personal(data.web3.currentProvider);
        personal.newAccount(data.pass,(err,acc)=>{
            if(err)next({err:err,address:null});
            else {
                console.log(id+'');
                let data = {userId:id+'',//convert ObjectId to String
                            address:acc,
                            currency:'ETH'};
                user.addUserAccount(data,(d)=>{
                    console.dir(data);
                    next({address:data.data});
                })
            }
        });
    },
    get:(req,next)=>{
        user.getUserAccounts(req.session.user._id,(data)=>{
          if(data.err)next(null);
          else next(data.data);
        })
    }

};