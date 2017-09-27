/**
 * Created by Nick on 31.07.2017.
 */

let user = require('../models/User');

function Auth(req,res,next){
    if (req.headers.authorization && req.headers.authorization.search('Basic ') === 0)
    {
        // fetch login and password
        let strpw = req.headers.authorization.split(' ')[1].split(':');
           const reqEmail = strpw[0];
        const reqPwd = strpw[1];
        user.getUserByEmail(reqEmail,res,function(err,result){
            if(!result){
                console.log('Unable to authenticate user by email');
                res.json({err:'Authentication wrong! Invalid email.', user:null});
            }else{
                if(reqPwd === user.decrypt(result.pwd)){
                    req.session.auth = {state:true,type:'common'};
                    req.session.user = result;
                    console.log('Authorize ');
                    console.dir(result);
                    next();}
                else{
                    console.log('Unable to authenticate user by password');
                    res.json({err:'Authentication wrong! Password incorrect.', user:null});
                }
            }
        });
    }
    else
    {
        if(req.session && req.session.auth.state && req.session.user !== undefined) next();
        else{
            console.log('Unable to authenticate user.');
            setTimeout(function () {
                res.json({err:'Authentication wrong!', user:null});
            }, 2000);
        }
    }
}
module.exports = Auth;