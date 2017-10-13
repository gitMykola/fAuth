let monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.host+':'+config.db.port+'/'+config.db.dbName),
    cryptor = require('crypto'),
    rnd = require('randomstring');

module.exports = {
    collection:'refreshTokens',
    /*
    * @id - Client Id
    * */
    getTokenById:function(id,next){
        db.get(this.collection).findOne({'_id':id},(err,token)=>{
            if(err)next({error:err.message,token:null});
            else next({error:null,token:token});
        });
    },
    getTokenByToken:function(rtoken,next){
        db.get(this.collection).findOne({'token':rtoken},(err,token)=>{
            if(err)next({error:err.message,token:null});
            else next({error:null,token:token});
        });
    },
    /*
    * @data = {
    *   @name - client name
    *   @secret - client secret
    * }
    * */
    setToken:function(data,next){
        if(this.validateData())
            db.get(this.collection).insert(data,(err,token)=>{
                if(err)next({error:err,token:null});
                else next({error:null,token:token});
            });
    },
    removeToken:function(rtoken,next){
        db.get(this.collection).remove({token:rtoken},(err)=>{
            if(err) next({error:err});
            else next({eror:null});
        })
    },
    /*
    * @data = {
    *   @name - client name ||
    *   @secret - client secret ||
    *   } ||
    *   @'SOME WRONG DATA'
    * */
    validateData:function(data){
        return true;
    },
};