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
        tempCollection:'tmpUsers',
        collectionEthereumAccounts:'ethAccounts',
        getUserById: function(id,next)
        {
            db.get(this.collectionName).findOne({'_id':id},function(err,user){
                next(err,(err)?null:user);
            });
        },
        getUserByName: function(name,next)
        {
            db.get(this.collectionName).findOne({'name':name},function(err,user){
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
        getUserByPhone: function(phone,next){
            let err = 'Invalid Phone!';
            if(!this.validateData({phone:phone}))next({error:err});
            else {
                db.get(this.collectionName).findOne({'phone':phone},(err,user)=>{
                    if(err)next({error:'Database error!'});
                    else next({error:null,data:user});
                });
            }
        },
        getTmpUserByPhone: function(phone,next){
            let err = 'Invalid Phone!';
            if(!this.validateData({phone:phone}))next({error:err});
            else {
                db.get(this.tempCollection).findOne({'phone':phone},(err,user)=>{
                    if(err)next({error:'Database error!'});
                    else next({error:null,data:user});
                });
            }
        },
        getAllUsers: function(res,next)
        {
            console.log('getAll');
            db.get(this.collectionName).find({},function(err,users){
                next(err,(err)?null:users);
            });
        },
        setTempUser: function(data,next){
            if(!this.validateData(data))next({error:'Data invalid'});
            else {
                data.message = rnd.generate(5);
                data.created_at = (new Date()).getTime();
                db.get(this.tempCollection).insert(data,(err,tmpUser)=>{
                    if(err)next({error:'Database error.'});
                    else next({error:null,data:data.message,u1:tmpUser._id.toString()});
                });
            }
        },
        setUser: function(data,next)
        {
            if(this.validateData(data))
            {
                //console.dir(data);
                if(data.pwd) data.pwd = this.encrypt(data.pwd);
                db.get(this.collectionName).insert(data,function(err,user){
                    if(err) next(err, null);
                    else next(null, user);
                });
            }else next('Data invalid!', null);
        },
        setUserByMessage:function(message,next){
            if(!this.validateData({message:message}))next({error:'Incorrect verify message!'});
            else{
                db.get(this.tempCollection).find({'message':message},(err,tmpUser)=>{
                    if(err)next({error:'Database error!'});
                    else{
                        if(tmpUser.length !== 1)next({error:'Wrong message!'});
                        else {
                            let staticUser = {
                                name:'PHONE USER',
                                phone:tmpUser[0].phone,
                                created_at:(new Date()).getTime(),
                                pwd:'111111',
                            };
                            db.get(this.collectionName).find({'phone':staticUser.phone},(err,users)=>{
                                if(err)next({error:'Database error!'});
                                else {
                                    if(users.length > 0)next({error:'Dublicate user!'});
                                    else this.setUser(staticUser, (err, user) => {
                                        if (err) next({error: 'Database error!'});
                                        else {
                                            db.get(this.tempCollection).remove({phone:staticUser.phone});
                                            next({error: null, data: user._id.toString()});
                                        }
                                    });
                                }
                            });

                        }
                    }
                });
            }
        },
        setUserConfig:function(userId,config,next){// Don't like to direct inserting to database!!!!!
            db.get(this.collectionName).findOne({'_id':userId},(err,usr)=>{
                if(err)next({error:err,data:null});
                else {
                    usr.config = config;
                    db.get(this.collectionName).update({'_id':usr._id},usr,(err,user)=>{
                        if(err) next({error:err});//'Database error!'});
                        else next({error:null,data:'Config has setted.'});
                    });
                }
            });

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
            db.get(this.collectionName).remove({'_id':id},function(err){
                next(err);
            });
        },
        deleteTmpUser: function(id,next)
        {
            db.get(this.tempCollection).remove({'_id':id},function(err){
                next(err);
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
            for(let ind in data)
            {
                if(data.hasOwnProperty(ind) && data[ind])
                {console.log(ind+' '+data[ind]+' '+data[ind].length);
                    switch(ind)
                    {
                        case 'name':
                            if(typeof(data[ind]) !== 'string' || data[ind].length < 3 || data[ind].length > 50 || !data[ind].match(/[a-zA-Z0-9@_.]/))
                                return false;
                            break;
                        case 'email':
                            if(typeof(data[ind]) !== 'string' || !data[ind].match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/))
                                return false;
                            break;
                        case 'pwd':
                            //if(!data[ind].match())return false;
                            break;
                        case 'phone':
                            if(typeof(data[ind]) !== 'string' || !data[ind].match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g) || data[ind].length !== 13)
                                return false;
                            break;
                        case 'message':
                            return (typeof(data[ind]) !== 'string' || data[ind].length < 5 && data[ind].length > 0);
                            break;
                        default:
                            break;
                    }
                }
            }
            return true;
        },
        encrypt: (password)=>
        {
            let cpass = {};
            cpass.salt = cryptor.randomBytes(config.crypt.saltLen).toString('hex');
            /*let cipher = cryptor.createCipher('aes-256-ctr', cpass.salt);
            cpass.pass = cipher.update(password.toString(), 'utf8', 'hex');
            cpass.pass += cipher.final('hex');*/
            cpass.pass = cryptor.pbkdf2Sync(password,
                cpass.salt,
                config.crypt.et,
                config.crypt.keyLen,
                config.crypt.alg).toString('hex');
            return cpass;
        },
        decrypt: (cpassword,salt)=>
        {
            /*let decipher = cryptor.createDecipher('aes-256-ctr', cpassword.salt);
            let pass = decipher.update(cpassword.pass, 'hex', 'utf8');
            pass += decipher.final('utf8');*/
            return cryptor.pbkdf2Sync(cpassword,
                salt,
                config.crypt.et,
                config.crypt.keyLen,
                config.crypt.alg).toString('hex');
        },
        verifyPassword:function(pass,user){
            //return pass === vf(user.pwd);
            return user.pwd.pass === this.decrypt(pass,user.pwd.salt)
        },
    };