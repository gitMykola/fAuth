let monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.url),
    cryptor = require('crypto'),
    rnd = require('randomstring');

module.exports = {
   collection:'clients',
    /*
    * @id - Client Id
    * */
   getClientById:function(id,next){
       db.get(this.collection).findOne({'_id':id},(err,client)=>{
           if(err)next({error:err.message,client:null});
           else next({error:null,client:client});
       });
   },
    /*
    * @name - Client Name
    * */
    getClientByName:function(name,next){
        db.get(this.collection).findOne({'name':name},(err,client)=>{
            if(err)next({error:err.message,client:null});
            else next({error:null,client:client});
        });
    },
    /*
    * @data = {
    *   @name - client name
    *   @secret - client secret
    * }
    * */
   setClient:function(data,next){
       if(this.validateData())
           db.get(this.collection).insert(data,(err,client)=>{
               if(err)next({error:err,client:null});
               else next({error:null,client:client});
           });
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