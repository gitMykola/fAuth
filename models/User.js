/**
 * Created by Nick on 24.07.2017.
 */
let express = require('express'),
    mongo = require('mongodb'),
    monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.host+':'+config.db.port+'/'+config.db.dbName),
    cryptor = require('crypto'),
    rnd = require('randomstring');

module.exports =
    {
        collectionName:'users',
        collectionEthereumAccounts:'ethAccounts',
        getUserById: function(id,res,next)
        {
            db.get(this.collectionName).findOne({'_id':id},function(err,user){
                next(err,(err)?null:user);
            });
        },
        getUserByEmail: function(email,res,next)
        {
            if(this.validateData({email:email}))
                db.get(this.collectionName).findOne({'email':email},function(err,user){
                    next(err,err?null:user);
                });
            else next('Invalid email: ' + email,null);
        },
        getAllUsers: function(res,next)
        {
            console.log('getAll');
            db.get(this.collectionName).find({},function(err,users){
                next(err,(err)?null:users);
            });
        },
        setUser: function(data,res,next)
        {
            if(this.validateData(data))
            {
                console.dir(data);
                if(data.pwd) data.pwd = this.encrypt(data.pwd);
                db.get(this.collectionName).insert(data,function(err,user){
                    if(err) next(err, null);
                    else next(null, user);
                });
            }else next('Data invalid!', null);
        },
        updateUser: function(id,data,res,next)
        {
            if(this.validateData(data))
            {
                db.get(this.collectionName).insert({'_id':id},data,function(err,user){
                    next(err,user);
                });
            }else res.send({err:'Data invalid!'});
        },
        deleteUser: function(id,res,next)
        {
            db.get(this.collectionName).delete({'_id':id},function(err,user){
                next(err,user);
            });
        },
        addUserAccount:(data,next)=>{
            db.get('ethAccounts').insert({user:data.userId,address:data.address,currency:data.currency},(err,account)=>{
                console.dir(err);
                if(err)next({err:err,data:null});
                else next({err:null,data:account});
            });
        },
        getUserAccounts:(userId,next)=>{
            console.log(userId);
            db.get('ethAccounts').find({user:userId},{user:userId,sort:{currecy:1}},(err,data)=>{
                if(err)next({error:err,data:null});
                else {
                    let acc = data.map((ac)=>{return {currency:ac.currency,address:ac.address};});
                    next({error:null,data:acc});
                }
            });
        },
        validateData: (data)=>
        {
            console.log('Data VERIFICATION');
            console.dir(data);
            for(let index in data)
            {
                if(data.hasOwnProperty(index))
                {
                    switch(data.index)
                    {
                        case 'name':
                            if(data.index.length < 3 && data.index.length > 50)
                                return false;
                            break;
                        case 'email':
                            if(data.index.length > 2 && data.index.length < 51)
                                return false;
                            break;
                        case 'pwd':
                            if(data.index.length > 2 && data.index.length < 51)
                                return false;
                            break;
                        default:break;
                    }
                }
            }
            return true;
        },
        encrypt: (password)=>
        {
            let cpass = {};
            cpass.salt = rnd.generate();
            let cipher = cryptor.createCipher('aes-256-ctr', cpass.salt);
            cpass.pass = cipher.update(password.toString(), 'utf8', 'hex');
            cpass.pass += cipher.final('hex');
            return cpass;
        },
        decrypt: (cpassword)=>
        {
            let decipher = cryptor.createDecipher('aes-256-ctr', cpassword.salt);
            let pass = decipher.update(cpassword.pass, 'hex', 'utf8');
            pass += decipher.final('utf8');
            return pass;
        },
        verifyPassword:(pass,user,vf)=>{
            return pass === vf(user.pwd);
        },
    };