let user = require('../models/User'),
    config = require('../services/config'),
    jwt  = require('jsonwebtoken'),
    xhr = require('../services/xhr');


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
                        },config.app.privateKey,{
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
        if(!data){
            console.log('No Authentication header!');
            req.auth = false;
            next();
        }else{
            jwt.verify(data,config.app.privateKey,(err,usr)=>{
                if(err){
                    req.auth = false;
                    next();
                }else{
                    req.auth = true;
                    req.user = usr.user;
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
    }

};