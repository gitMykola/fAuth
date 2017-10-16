let user = require('../models/User'),
    config = require('../services/config'),
    jwt  = require('jsonwebtoken');

function jwtAuthorization(req,res,next){
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
}

module.exports = jwtAuthorization;