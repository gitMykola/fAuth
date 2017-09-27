/**
 * Created by Nick on 24.07.2017.
 */
let express = require('express'),
    mongo = require('mongodb'),
    monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.host+':'+config.db.port+'/'+config.db.dbName),
    cryptor = require('crypto');

module.exports =
    {
        collectionName:'users',
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
        validateData: function(data)
        {
            return true;
        },
        encrypt: function(password)
        {
            let cipher = cryptor.createCipher('aes-256-ctr', config.app.privateKey);
            let cpass = cipher.update(password.toString(), 'utf8', 'hex');
            cpass += cipher.final('hex');
            return cpass;
        },
        decrypt: function(cpass)
        {
            let decipher = cryptor.createDecipher('aes-256-ctr', config.app.privateKey);
            let pass = decipher.update(cpass, 'hex', 'utf8');
            pass += decipher.final('utf8');
            return pass;
        },
    }