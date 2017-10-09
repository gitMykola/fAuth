let express = require('express'),
    mongo = require('mongodb'),
    monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.host+':'+config.db.port+'/'+config.db.dbName),
    Personal = require('web3-eth-personal'),
    user = require('../models/User');

module.exports = {
    create:(data, next)=>{
        let udata = data;
        let personal = new Personal(data.web3.currentProvider);
        personal.newAccount(udata.pass,(err,acc)=>{
            if(err)next({err:err,address:null});
            else {
                //console.log(id+'');
                let data = {userId:udata.userId,
                            address:acc,
                            currency:'ETH'};
                user.addUserAccount(data,(d)=>{
                    console.dir(data);
                    next({address:data.address});
                })
            }
        });
    },
    createForPhoneUser:(data, next)=>{
        let udata = data;
        user.getUserAccounts(udata.userId,(dat)=>{
            if(dat.err)next({error:err,data:null});
            else {
                if(dat.err)next({error:'Database error',data:null});
                else if(dat.data.length === 0){
                        let personal = new Personal(udata.web3.currentProvider);
                        personal.newAccount(udata.pass,(err,acc)=>{
                            if(err)next({err:err,address:null});
                            else {
                                //console.log(id+'');
                                let ldata = {userId:udata.userId,
                                    address:acc,
                                    currency:'ETH'};
                                user.addUserAccount(ldata,(d)=>{
                                    console.dir(ldata);
                                    next({address:ldata.address});
                                });
                            }
                        });
                }else next({error:'Account already created!',data:null});
            }
        });

    },
    get:(id,next)=>{
        user.getUserAccounts(id,(data)=>{
          next(data.err,data.data);
        })
    },
    getTransactions:(web3,account,next)=>{
        let acc = account;
        switch(acc.currency){
            case('ETH'):
                web3.eth.getTransactionCount(acc.address,(err,count)=>{
                    //console.log('Test address '+acc.address);
                    if(err)next(0);//0 - for test accepting
                    else next(count);
               });
                break;
            case('BTC'):
                break;
            default:next(null);
        }
    }

};