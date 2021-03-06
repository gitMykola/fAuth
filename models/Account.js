let express = require('express'),
    mongo = require('mongodb'),
    monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.url),
    Personal = require('web3-eth-personal'),
    user = require('../models/User'),
    randStr = require('randomstring'),
    md5 = require('js-md5'),
    xhr = require('../services/xhr');

module.exports = {
    tempTransaction: 'tmpTX',
    ethTxCollection: 'ethTransactions',
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
    createForPhoneUser:function(uObj, next){
        user.getUserAccounts(uObj.userC._id.toString(),(dat)=>{
            if(dat.err)next({error:'Database error',address:null});
            else if(dat.data.length === 0){
                        let personal = new Personal(uObj.web3.currentProvider);
                        personal.newAccount(uObj.pass,(err,acc)=>{
                            if(err)next({error:err,address:null});
                            else {
                                //console.log(id+'');
                                let ldata = {userId:uObj.userC._id.toString(),
                                    address:acc,
                                    currency:'ETH'};
                                user.addUserAccount(ldata,(d)=>{
                                    console.dir(ldata);
                                    next({error:null,address:ldata.address});
                                });
                            }
                        });
                }else next({error:'Exists!',address:null});
        });

    },
    createAccountsViaPassword:function(req,res,next){
        res.resData = {rp: null, rp1: null};
        if (!user.validateData(req.body)) {
            res.resData.rp = 0;
            next(res.resData);
        } else {
            //console.log(req.query.sp);
            //console.log(md5(req.body.sp));
            if(md5(req.query.sp) !== req.body.sp){
                res.resData.rp = 3;
                next(res.resData);
            } else {
                user.getUserByParam({u1:req.query.sp},(usr)=>{
                    if(usr.error){
                        res.resData.rp = 3;
                        next(res.resData);
                    }else {
                        usr.data.pwd = user.encrypt(req.body.p001);
                        user.updatePhoneUser(usr.data._id,usr.data,(err,userK)=>{
                                this.createForPhoneUser({
                                    userC: usr.data,
                                    web3: req.web3,
                                    pass: req.body.p001,
                                }, (acc) => {
                                    if (acc.error) {
                                        res.resData.rp = (acc.error === 'Exists!') ? 1 : 6;// Database || ETH Error
                                        next(res.resData);
                                    } else {
                                        next(res.resData);
                                    }
                                })
                        })
                    }
                })
            }
        }
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
    getBalance:function(req,res,next){
        user.getUserByParam({phone:req.user},(usr)=>{
            if(usr.error)next(null);
            else user.getUserAccounts(usr.data._id.toString(),(acc)=>{
                if(acc.error || !acc.data.length)next(null);
                else {
                    let fn = (k,ac,nx)=>{
                        if(k === ac.length)nx(ac.map((a) => {
                                                    return {
                                                        cu: a.currency,
                                                        ad: a.address,
                                                        ba: a.balance
                                                    }}));
                        else req.web3.eth.getBalance(ac[k].address,(err,bal)=>{
                            if(err)ac[k].balance = 0;
                            else ac[k].balance = bal;
                            k++;
                            fn(k,ac,nx);
                        })
                    };
                    fn(0,acc.data,next);
                }
            })
        })
    },
    getTransactionsJournal:function(userId,web3,next){
        user.getUserAccounts(userId, (ac)=>{
            console.dir(ac);
            if(ac.error || !ac.data.length) next({error:'Account error',data:null});
            else db.get(this.ethTxCollection).find({"from":(ac.data[0].address).toLowerCase()},{
                sort:{created_at:-1}},(err,tx)=>{
                    if(err) next({error:'TX error!'});
                    else db.get(this.ethTxCollection).find({"to":ac.data[0].address.toLowerCase()},{
                            sort:{created_at:-1}},(err,tt)=> {
                            if (err) next({error: 'TX error!'});
                            else {
                                let intBalance = 0;
                                for (let i = 0;i < tx.length;i++)intBalance -= Number (tx[i].value) + Number(tx[i].gasPrice) * Number(tx[i].gasUsed);//console.log(tx[i].value + tx[i].gasPrice * tx[i].gasUsed )}
                                for (let i = 0;i < tt.length;i++)intBalance += Number (tt[i].value);// - Number(tt[i].gasPrice) * Number(tt[i].gasUsed);//console.log(tt[i].value - tt[i].gasPrice * tt[i].gasUsed)}
                                console.log('Balance ' + intBalance);
                                console.log('TX LEN' + tx.length);
                                console.log('TT LEN' + tt.length);
                                web3.eth.getBalance(ac.data[0].address,(err,bal)=>{
                                    if(err)next({error:'Geth error!'});
                                    else if(Math.round(intBalance/1e6) !== Math.round(bal/1e6)){
                                       //console.log('Failure! ' + intBalance + ' ' + bal);
                                       let url = config.etherscan.apiURL
                                           + '?module=account&action=txlist&address='
                                           + ac.data[0].address
                                           + '&startblock='
                                           + config.etherscan.startBlock
                                           +'&endblock=99999999&sort=asc&apikey='
                                           + config.etherscan.apiKey;

                                       console.log(url);
                                       xhr.get(url)
                                           .then((response)=> {
                                               let r = JSON.parse(response);
                                               //console.dir(r.result);
                                               if (!r.message || r.message !== 'OK' || !r.result || !r.result.length)
                                                   next({error: 'Etherscan error!'});
                                                   else{
                                                   let txjournal = r.result.map((e) => {
                                                   return {
                                                       hash: e.hash,
                                                       from: e.from,
                                                       to: e.to,
                                                       value: e.value,
                                                       created_at: Number (e.timeStamp) * 1000,
                                                       gasPrice: e.gasPrice,
                                                       gasUsed: e.gasUsed
                                                            }
                                                        });
                                                   db.get(this.ethTxCollection).remove({$or:[{'to': ac.data[0].address.toLowerCase()},
                                                       {'from': ac.data[0].address.toLowerCase()}]},(err)=>{
                                                      if(err) next({error:'DB error!'});
                                                      else db.get(this.ethTxCollection).insert(txjournal,(err,txj)=>{
                                                          if(err)next({error: 'DB error!'});
                                                          else {
                                                              let income = [],
                                                                  outcome = [];
                                                              //console.dir(txjournal);
                                                              for(let i = 0; i < txjournal.length; i++)
                                                                  if(txjournal[i].from === ac.data[0].address.toLowerCase())
                                                                  outcome.push({
                                                                      timestamp: txjournal[i].created_at,
                                                                      to: txjournal[i].to,
                                                                      ammount: txjournal[i].value,
                                                                      fee: Number(txjournal[i].gasPrice) * Number(txjournal[i].gasUsed)
                                                                  }); else income.push({
                                                                      timestamp: txjournal[i].created_at,
                                                                      from: txjournal[i].from,
                                                                      ammount: txjournal[i].value,
                                                                      fee: Number(txjournal[i].gasPrice) * Number(txjournal[i].gasUsed)
                                                                  });
                                                              next({error: null, tx: outcome, tt: income});
                                                          }
                                                      })
                                                   });
                                                   }
                                           },(reject)=>{next({error: 'Etherscan Error!'})})
                                    }else next({
                                        error: null, tx: tx.map((t) => {
                                            return {
                                                timestamp: t.created_at,
                                                to: t.to,
                                                ammount: t.value,
                                                fee: Number(t.gasPrice) * Number(t.gasUsed)
                                            }
                                        }),tt: tt.map((t) => {
                                            return {
                                                timestamp: t.created_at,
                                                from: t.from,
                                                ammount: t.value,
                                                fee: Number(t.gasPrice) * Number(t.gasUsed)
                                            }
                                        })
                                    })
                                });

                            }
                        })
            })
        })
    },
    createPhoneTransaction:function(data,next){
        user.getUserById(data.userId,null,(err,usr)=>{
            console.dir(usr);
            if(err)next({error:err,data:null});
            else {
                this.add(data,(err,aTx)=>{
                    if(err && !usr.config) next({error:'Can\'t create temporary transaction!',data:null});
                    else {
                            if (usr.config.googleAuth) next({
                                error: null,
                                data: 'Please, confirm transaction via Google.'
                                });
                            else next({error: null, data: aTx});
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
    *           passphrase:string,
    *           ammount:number}
    * */
    sendTX:function(web3,data,next){
        user.getUserByPhone(data.phone,(usr)=>{
           if(usr.error)next({error:usr.error,data:null});
           else {
               usr = usr.data;
               if(!usr) user.setUser({
                   name:'PHONE USER',
                   phone:data.phone,
                   created_at:(new Date()).getTime(),
                   pwd:'111111',
               },(err,rslt)=>{
                   usr = rslt;
                   user.getUserAccounts(usr._id.toString(),(acc)=>{
                       if(acc.error)next({error:acc.error,data:null});
                       else {
                           let obj = {
                               web3:web3,
                               sender:data.userId,
                               senderPass:data.passphrase,
                               user:usr,
                               userId:usr._id.toString(),
                               pass:randStr.generate(8),
                               ammountTX:data.ammount
                           };
                           console.dir(acc);
                           acc = acc.data;
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
                                           obj.senderAddress = accnt.data[0].address;
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
                                                       ' on Ethereum address: ' + obj.addressTo + ' ' +
                                                       'with passphrase '+ obj.pass});
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
                           db.get(this.tempTransaction).remove({phone:obj.user.phone},
                               (err,rp)=>console.log('Tmp transaction removed.'));
                       }
                   });
               });
               else user.getUserAccounts(usr._id.toString(),(acc)=>{
                   console.dir(acc);
                   if(acc.error)next({error:acc.error,data:null});
                   else {
                       let obj = {
                           web3:web3,
                           sender:data.userId,
                           senderPass:data.passphrase,
                           user:usr,
                           userId:usr._id.toString(),
                           pass:randStr.generate(8),
                           ammountTX:data.ammount
                       };
                       acc = acc.data;
                       if(acc.length === 0)
                       {
                           /*console.log('create new addresS and ' +
                               'write to ethAccounts,' +
                               'unlock(data.pass,data address),' +
                               //'get from tpmTX,' +
                               'send to addresS,' +
                               'lock data.adress' +
                               'send SMS to data.phone');*/

                           user.getUserAccounts(obj.sender,(accnt)=>{
                               if(accnt.error) next({error:accnt.error,data:null});
                               else this.create(obj,(adr)=>{
                                   if(adr.err)next({error:adr.err,data:null});
                                   else {                                          // !check response number accounts
                                       obj.addressTo = adr.address;
                                       obj.senderAddress = accnt.data[0].address;
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
                                                   ' on Ethereum address: ' + obj.addressTo + ' ' +
                                                   'with passphrase '+ obj.pass});
                                               });
                                           })
                                       });
                                   }
                               });
                           });

                       }
                       else {
                           /*console.log('unlock(data.pass,data address),' +
                               //'get from tpmTX,' +
                               'send to acc[0].address,' +
                               'lock data.adress' +
                               'send SMS to data.phone');*/
                           obj.addressTo = acc[0].address;
                           user.getUserAccounts(obj.sender,(accnt)=>{
                               if(accnt.error) next({error:accnt.error,data:null});
                               else {
                                   obj.senderAddress = accnt.data[0].address;
                                   let pers = new Personal(obj.web3);
                                   //console.dir(obj);
                                   pers.unlockAccount(obj.senderAddress, obj.senderPass, 1000, (err, result) => {
                                       if (err) next({error: err, data: null});
                                       else {
                                           let ttx = {
                                               from: obj.senderAddress,
                                               to: obj.addressTo,
                                               value: obj.ammountTX
                                           };
                                           //console.dir(ttx);
                                           obj.web3.eth.sendTransaction(ttx, (err, hash) => {
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
                                        }
                                   });
                               }
                           });
                       }
                       db.get(this.tempTransaction).remove({phone:obj.user.phone},
                           (err,rp)=>console.log('Tmp transaction removed.'));
                   }
               });
           }

        });
    },
    sendEthTx:function(req,res,next){
        console.dir(req.user);
        user.getUserByParam({phone:req.user},data=>{
            console.dir(data);
            if(data.err)next(0);                        // Sender error
            else user.getUserAccounts(data.data._id.toString(),(sender)=>{
                console.dir(sender);
                if(sender.error || !sender.data.length)next(0); //Sender account error
                else if(!user.verifyPassword(req.body.p001,data.data))next(0);  // Sender password error
                    else user.getUserByParam({phone:req.body.to},dt=>{
                        if(dt.error)next(0);    //Reciever error
                        else user.getUserAccounts(dt.data._id.toString(),to=>{
                            if(to.error || !to.data.length)next(0); //Reciever accounts error
                            else {
                                let pers = new Personal(req.web3);
                                pers.unlockAccount(sender.data[0].address,req.body.p001,1000,(err,result)=>{
                                    if(err)next(2);
                                    else req.web3.eth.sendTransaction({
                                        from:sender.data[0].address,
                                        to:to.data[0].address,
                                        value:req.body.am,
                                    },(err,hash)=>{
                                        console.dir(err);
                                        if(err)next(0); //Transaction error
                                        else next(hash);
                                        db.get(this.ethTxCollection).insert({
                                            "hash":hash,
                                            "from":sender.data[0].address,
                                            "to":to.data[0].address,
                                            "value":req.body.am,
                                            "created_at":(new Date()).getTime()
                                        },(err,tx)=>{
                                            if(err) console.log('Local saving transaction error: ' + err);
                                            else console.log('Transation local saved: ' + tx.toString());
                                        });
                                        pers.lockAccount(sender.data[0].address,req.body.p001,1000,(err,reslt)=>console.log(err));
                                    })
                                })
                            }
                        })
                    })
            })
        })
    },
    confirm:function (web3,data,next) {
        this.googleLogin({},(resp)=>{
              if(resp.error)next(resp);
              else db.get(this.tempTransaction).find({userId:data.userId},(err,tmpTx)=>{
                  if(err)next({error:err,data:null});
                  else this.sendTX(web3,tmpTx[0],(r)=>{
                      next(r);
                  })
              });
        });
        //next(data);//if Google confirm users
    },
    googleLogin:(data,next)=>{
        next({error:null,auth:'Ok!'});
    },
    checkContacts:function(req,res,next){
      let cs = req.body;
      if(cs && typeof(cs) === 'object') {
          let fn = function (k, cont, nx) {
              if (k === Object.keys(cont).length) nx(cont);
              else user.getUserByParam({phone: cont[Object.keys(cont)[k]]}, (usr) => {
                  if (usr.data) cont[Object.keys(cont)[k]] = 1;
                  else cont[Object.keys(cont)[k]] = 0;
                  k++;
                  fn(k, cont, nx);
              })
          };
          fn(0, cs, next);
      }else next(0);
    },

};