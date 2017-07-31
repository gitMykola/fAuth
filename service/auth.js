/**
 * Created by Nick on 31.07.2017.
 */
var Auth = function(req,res,next){
        if (req.headers.authorization && req.headers.authorization.search('Basic ') === 0) {
            // fetch login and password
            var strpw = req.headers.authorization.split(' ')[1].split(':');
            const reqEmail = strpw[0];
            const reqPwd = strpw[1];
            var collection = req.db.get('users');
            collection.findOne({'email':reqEmail},function(err,result){
                if(result && result !== null && reqPwd == result.pwd){
                    req.session.auth = true;
                    req.session.user = result;
                    next();
                    //return;
                }else{
                    console.log('Unable to authenticate user');
                    console.log(req.headers.authorization);
                    res.header('WWW-Authenticate', 'Basic realm="Restricted Area"');
                    res.send('Authentication required', 401);}
            });
        }else {
            if(req.session.auth == false) {
                console.log('Unable to authenticate user');
                console.log(req.headers.authorization);
                res.header('WWW-Authenticate', 'Basic realm="Restricted Area"');
                if (req.headers.authorization) {
                    setTimeout(function () {
                        res.send('Authentication required', 401);
                    }, 2000);
                } else {
                    res.send('Authentication required', 401);
                }
            }else next();
        }
    };
module.exports = Auth;
