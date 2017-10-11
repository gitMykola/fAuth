let express = require('express'),
    mongo = require('mongodb'),
    monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.host+':'+config.db.port+'/'+config.db.dbName),
    Personal = require('web3-eth-personal'),
    user = require('../models/User'),
    randStr = require('randomstring');

module.exports = {
    tempTransaction:'tmpTX',
    /*
    * data => {web3:web3,
    *           pass:string,
    *           userId:string}
    * */
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
    },
    createPhoneTransaction:function(data,next){
        user.getUserById(data.userId,null,(err,usr)=>{
            if(err)next({error:err,data:null});
            else {
                this.add(data,(err,aTx)=>{
                    if(err) next({error:'Can\'t create temporary transaction!',data:null});
                    else {
                            if (usr.config.googleAuth) next({
                                error: null,
                                data: 'Please, confirm transaction via Google.'
                                });
                            else next({error: null, data: txData});
                        }
                });

            }
        });
    },
    add:function(data,next){
        db.get(this.tempTransaction).insert(data,(err,tx)=>{
            next(err,tx);
        });
    },
    /*
    * data => {phone:string,
    *           userId:string,
    *           ammount:number}
    * */
    sendTX:function(web3,data,next){
        user.getUserByPhone(data.phone,(usr)=>{
           if(usr.error)next({error:usr.error,data:null});
           else user.getUserAccounts(usr._id.toString(),(acc)=>{
               if(acc.error)next({error:acc.error,data:null});
               else {
                   let obj = {
                       web3:data.web3,
                       sender:data.userId,
                       senderPass:data.passphrase,
                       user:usr,
                       userId:usr._id.toString(),
                       pass:randStr.generate(8),
                       ammountTX:data.ammount
                   };
                   if(acc.length === 0)
                   {
                       console.log('create new addresS and ' +
                           'write to ethAccounts,' +
                           'unlock(data.pass,data address),' +
                           //'get from tpmTX,' +
                           'send to addresS,' +
                           'lock data.adress' +
                           'send SMS to data.phone');

                        user.getUserAccounts(obj.sender,(accnt)=>{
                            if(accnt.error) next({error:accnt.error,data:null});
                            else this.create(obj,(adr)=>{
                                if(adr.err)next({error:adr.err,data:null});
                                else {                                          // !check response number accounts
                                    obj.addressTo = adr.address;
                                    obj.senderAddress = accnt[0].address;
                                    let pers = new Personal(obj.web3);
                                    pers.unlockAccount(obj.senderAddress.address,obj.senderPass,1000,(err,result)=>{
                                        if(err)next({error:err,data:null});
                                        else obj.web3.eth.sendTransaction({
                                            from:obj.senderAddress,
                                            to:obj.addressTo,
                                            value:obj.ammountTX
                                        },(err,hash)=>{
                                            if(err)next({error:err,data:null});
                                            else pers.lockAccount(obj.senderAddress,obj.senderPass,(err,r)=>{
                                                if(err)console.log('Account ' + obj.senderAddress +
                                                    ' not locked');
                                                next({error:null,data:'User ' +
                                                obj.user.phone + ' can recieve his ammount' +
                                                ' on Ethereum address: ' + obj.addressTo});
                                            });
                                        })
                                    });
                                }
                            });
                        });

                   }
                   else {
                       console.log('unlock(data.pass,data address),' +
                           //'get from tpmTX,' +
                           'send to acc[0].address,' +
                           'lock data.adress' +
                           'send SMS to data.phone');
                       obj.addressTo = acc[0].address;
                       user.getUserAccounts(obj.sender,(accnt)=>{
                           if(accnt.error) next({error:accnt.error,data:null});
                           else {
                               obj.senderAddress = accnt[0].address;
                               let pers = new Personal(obj.web3);
                               pers.unlockAccount(obj.senderAddress.address, obj.senderPass, 1000, (err, result) => {
                                   if (err) next({error: err, data: null});
                                   else obj.web3.eth.sendTransaction({
                                       from: obj.senderAddress,
                                       to: obj.addressTo,
                                       value: obj.ammountTX
                                   }, (err, hash) => {
                                       if (err) next({error: err, data: null});
                                       else pers.lockAccount(obj.senderAddress, obj.senderPass, (err, r) => {
                                           if (err) console.log('Account ' + obj.senderAddress +
                                               ' not locked');
                                           next({
                                               error: null, data: 'User ' +
                                               obj.user.phone + ' can recieve his ammount' +
                                               ' on Ethereum address: ' + obj.addressTo
                                           });
                                       });
                                   })
                               });
                           }
                       });
                   }
               }
           });
        });
    },
    confirm:function (data,next) {
        next(data);//if Google confirm users
    }
};