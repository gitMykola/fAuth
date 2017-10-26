let user = require('../models/User'),
    cryp = require('crypto'),
    jwt  = require('jsonwebtoken'),
    xhr = require('../services/xhr'),
    pair = require('keypair'),
    cbroserify = require('crypto-browserify');


module.exports = {
    jwtAuthorization:function(req,res,next){
    let data = req.headers['authorization'];
    if(!data){
        console.log('No Authorization header!');
        next({auth:false});
    }else{
        data = new Buffer(data.split(" ",2)[1], 'base64').toString('ascii');
        user.getUserByParam({phone:data.split(":")[0]},(usr)=>{
            if(usr.error)next({auth:0});
            else{
                if(!usr.data)next({auth:1});
                    else if(user.verifyPassword(data.split(":")[1],usr.data))
                    {
                        let token = jwt.sign({
                            user:usr.data.phone
                        },global.config.app.privateKey,{
                            expiresIn:60*60
                        });
                        next({token:token});
                    }else next({auth:2});
            }
        });
    }
},
    jwtAuthentication:function(req,res,next){
        let data = req.headers['x-access-token'];
        console.dir(!data);
        if(!data){
            console.log('No Authentication header!');
            req.auth = false;
            next();
        }else{
            jwt.verify(data,global.config.app.privateKey,(err,usr)=>{
                console.dir(usr);
                req.texp = false;
                if(err){
                    req.auth = false;
                    req.texp = true;
                    next();
                }else{
                    req.auth = true;
                    req.user = usr.user;
                    console.dir(usr.user);
                    next();
                }
            });
        }

    },

//module.exports = jwtAuthorization;

    googleTokenVerify:function (req,res,next){
        if(!req.body.rt)next(false);
        else{
            xhr.get('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + req.body.rt)
                .then(response=>{
                    if(response.error)next(false);
                    else next(true);                //May be email validation !?!?!?
                },reject=>{next(false)});
        }
    },

    cryptoRSAInit:function(req,res,next){
        if(!req.body || !req.body.as)next({ac:1});
        else user.getUserByParam({'phone':req.user},usr=>{
            if(usr.error)next({ac:2});
            else {
                usr.data.publicKey = Buffer.from(req.body.as, 'base64').toString();
                usr.data.serverRSAKeys = pair();
                console.dir(usr.data.serverRSAKeys);
                user.updatePhoneUser(usr.data._id,usr.data,(err,user)=>{
                    if(err)next({ac:3});
                    else {
                        res.setHeader('access-control-expose-headers', 'res-spk');
                        res.setHeader('res-spk',
                            Buffer.from(usr.data.serverRSAKeys.public).toString('base64'));
                        next({ac:null});
                    }
                })
            }
        })
    },

    decryptUserData:function(req,res,next){
        if(!req.body || !req.body.dt || !req.body.vr) next({ec:1});
        else {
            user.getUserByParam({'phone':req.user},usr=>{
                if(usr.error)next({ec:0});
                else {
                    const key = usr.data.userAESkey;
                   const decipher = cryp.createDecipheriv('aes-256-cbc',
                        key,
                        Buffer.from(req.body.vr));
                    let dcd = decipher.update(req.body.dt, 'hex', 'utf8');
                    dcd += decipher.final('utf8');
                    console.dir(dcd);
                    next({ec:dcd});
                }
            })
        }
    },

    receiveAS:function(req,res,next){
        if(!req.body || !req.body.ae)next({ac:1});
        else {
            console.dir(req.body.ae);
            user.getUserByParam({'phone':req.user},usr=>{
                if(usr.error)next({ac:0});
                else {
                    let reqData = cbroserify.privateDecrypt(usr.data.serverRSAKeys.private,
                        Buffer.from(req.body.ae));
                    usr.data.userAESkey = Buffer.from(reqData).toString();
                    user.updatePhoneUser(usr.data._id,usr.data,(err,us)=>{
                        if(err) next({ac:0});
                        else
                        {
                            console.log(usr.data.userAESkey);
                            next({ac: null});
                        }
                    })
                }
            })
        }
    }



};