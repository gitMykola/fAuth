/**
 * Created by Nick on 24.07.2017.
 */
let express = require('express'),
    mongo = require('mongodb'),
    monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.host+':'+config.db.port+'/'+config.db.dbName),
    cryptor = require('crypto'),
    rnd = require('randomstring'),
    md5 = require('js-md5'),
    valid = require('../services/validation'),
    net = require('net');

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
        getUserByParam: function(param,next){
            let err = 'Invalid Param!';
            if(!this.validateData(param))next({error:err});
            else {
                db.get(this.collectionName).findOne(param,(err,user)=>{
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
        setTempPhoneUser:function(req,res,next){
            console.dir(req.body);
            res.resData = {r:valid.format(req.body),r1:{k1:null,u1:null}};
            if(res.resData.r)next(res.resData);
            else if(!this.validateData({phone:req.body.pn})) {
                    res.resData.r = 0;
                    next(res.resData);
                }
                 else this.getUserByPhone(req.body.pn,(data)=>{
                    if(data.error){
                        res.resData.r = 'Serever database error!';
                        next(res.resData);
                    }else{
                        if(data.data){
                            res.resData.r = 1;
                            next(res.resData);
                        }else{
                            this.getTmpUserByPhone(req.body.pn,(tmpData)=> {
                                if(tmpData.error){
                                    res.resData.r = 'Serever database error!';
                                    next.json(res.resData);
                                }else {
                                    if(tmpData.data){
                                        res.resData.r = 1;
                                        next(res.resData);
                                    }else {
                                        let tmpUser = {
                                            name: 'PHONE USER',
                                            phone: req.body.pn,
                                            userOS:req.body.on,
                                            userIp:req.body.h1,
                                            userIMEI:req.body.p3,
                                            userLang:req.body.ul,
                                            u1:rnd.generate(32),
                                        };
                                        this.setTempUser(tmpUser, (ms) => {
                                            if (ms.error) {
                                                res.resData.r = 'Serever database error!';
                                                next(res.resData);
                                            } else {
                                                res.resData.r1.k1 = ms.data;
                                                res.resData.r1.u1 = tmpUser.u1;
                                                next(res.resData);
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
        },
        setTempUser: function(data,next)    {
            if(!this.validateData(data))next({error:'Data invalid'});
            else {
                data.message = valid.rndNumber(5);
                data.created_at = (new Date()).getTime();
                db.get(this.tempCollection).insert(data,(err,tmpUser)=>{
                    if(err)next({error:'Database error.'});
                    else next({error:null,data:data.message});
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
        sendSmsConfirmation:function(req,res,next){
            res.resData = {rs:valid.format(req.body),rs1:{us1:null}};
            if(res.resData.rs)next(res.resData);
            else this.getUserByPhone(req.body.ph,(data)=> {
                if (data.error) {
                    res.resData.rs = 'Serever database error!';
                    next(res.resData);
                } else {
                    if (data.data) {
                        res.resData.rs = 1;
                        next(res.resData);
                    } else {
                        this.getTmpUserByPhone(req.body.ph,(tmpUser)=>{
                            if(tmpUser.error){
                                res.resData.rs = 'Serever database error!';
                                next(res.resData);
                            }else if(!tmpUser.data){
                                res.resData.rs = 2;
                                next(res.resData);
                            }else if(req.body.ss !== tmpUser.data.message){
                                res.resData.rs = 3;
                                next(res.resData);
                            }else if(req.body.s !== md5(tmpUser.data.u1.toString())){
                                res.resData.rs = 4;
                                next(res.resData);
                            }else if((Date.now() - tmpUser.data.created_at) > config.app.tmpUserLive){
                                //console.log((Date.now() - tmpUser.data.created_at));
                                res.resData.rs = 5;
                                next(res.resData);
                            }else this.setUser({
                                name:'PHONE USER',
                                phone:tmpUser.data.phone,
                                created_at:tmpUser.data.created_at,
                                userOS:tmpUser.data.userOS,
                                userIp:tmpUser.data.userIp,
                                userIMEI:tmpUser.data.userIMEI,
                                userLang:tmpUser.data.userLang,
                                u1:rnd.generate(32)
                            },(err,staticUser)=>{
                                if(err){
                                    res.resData.rs = 'Server Database error!!';
                                    next(res.resData);
                                }else{
                                    this.deleteTmpUser(tmpUser.data._id.toString(),(err)=>{
                                        if(err){
                                            res.resData.rs = 'Server Database error!';
                                            next(res.resData);
                                        }else{
                                            res.resData.rs1.us1 = staticUser.u1.toString();
                                            next(res.resData);
                                        }
                                    })
                                }
                            });
                        })
                    }
                }
            })
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
        updatePhoneUser: function(id,data,next)
        {
            if(this.validateData(data))
            {
                db.get(this.collectionName).update({'_id':id},data,function(err,user){
                    next(err,user);
                });
            }else next('Data invalid!',null);
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
            console.log('User data VALIDATION');
            console.dir(data);
            for(let ind in data)
            {
                if(/*data.hasOwnProperty(ind) && */data[ind])
                {console.log(ind+' '+data[ind]+' '+data[ind].length);
                    switch(ind)
                    {
                        case 'name':
                            return (typeof(data[ind]) === 'string' && data[ind].length > 1 && data[ind].length < 51 && data[ind].match(/[a-zA-Z0-9@_.]/));
                            break;
                        case 'email':
                            return (typeof(data[ind]) === 'string' && data[ind].match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/));
                            break;
                        case 'pwd':
                            //if(!data[ind].match())return false;
                            return typeof(data[ind] === 'object');
                            break;
                        case 'phone':
                            return (typeof(data[ind]) === 'string' && data[ind].match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g) && data[ind].length === 13);
                            break;
                        case 'message':
                            return (typeof(data[ind]) === 'string' && data[ind].length === 5);
                            break;
                        case '_id':
                            return (typeof(data[ind] === 'object') && data[ind].toString().length === 24);
                            break;
                        case 'created_at':
                            return (typeof(data[ind]) === 'number' && data[ind].toString().length === 13);
                            break;
                        case 'userOS':
                            return (data[ind] === 0 || data[ind] === 1);
                            break;
                        case 'userIp':
                            return net.isIP(data[ind]);
                            break;
                        case 'userIMEI':
                            return (data[ind].length === 15 && Boolean(Number(data[ind])));
                            break;
                        case 'userLang':
                            return (data[ind].length === 2 && data[ind] === data[ind].toLowerCase());
                            break;
                        case 'u1':
                            return (data[ind].length === 32);
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