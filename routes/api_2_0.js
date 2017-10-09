let express = require('express'),
    auth = require('../services/auth'),
    accounts = require('../models/Account'),
    config = require('../services/config'),
    user = require('../models/User'),
    router = express.Router();

/*
*   (1) Recieve phone number
*   parameters:
*       phone - string (phone nymber with format - +3***********) //insert
*           into temporary storage
*   response:
*       error - null || string ('User with $request.body.phone exists.') if phone's
 *          present in database
*       data:
 *          message - string (random four digits)
 *          tempId - string (user id from temporary storage)
 *          || null
 */
router.post('/genesis',(req,res)=>{
    let err = {error:'Data invalid!!'};
    if(req.body && req.body.phone)
    {
        user.setTempUser({phone:req.body.phone},function(data){
            if(data.error) res.json({err});
            else res.json(data);
        });
    }else res.json(err);
});

/*
*   (2) Recieve four digits
*   parameters:
*       data:
    *       message - string (for digits from (1) response) //replace user object
    *           from temporary to common storage
    *       tempId - string (user id from (1) response)
*   response:
*       error - null || string ('Wrong message data!') if four digits
*           combination don't exist into temporary table
*       data - string (userId from common storage) || null
* */
router.post('/message',(req,res)=>{// yzjQ
    let err = {error:'Data invalid!!'};
    if(req.body && req.body.message){
        user.setUserByMessage(req.body.message,(data)=>{
            if(data.error)res.json({error:data.error});
            else res.json({error:null,data:data});
        })
    }else res.json(err);
});

/*
*   (3) Recieve passfrase
*   parameters:
*       userId - string (user id)
*       passfrase - string (eight symbols)
*   response:
*       error - null || string ('Fault to create account. Try one more time.')
*       data - string ('Ok') || null
* */
router.post('/account',(req,res)=>{
    res.json({error:null,data:null});
});

/*
*   (4) Recieve config user object
*   parameters:
*       userId - string (user id)
*       config:
*           googleAuth - true || false
*   response:
*       error - null || string ('Configuration wrong!')
*       data - string ('Ok') || null
*
* */
router.post('/config',(req,res)=>{
    res.json({error:null,data:null});
});

/*
*   (5) Resieve transaction data
*   parameters:
*       userId - string (user id)
*       to - string (recipient phone number)
*       amount - string (ethereum amount)
*   response:
*       error - null || string ('Transaction proccess fault.')
*       data - string ('Ok') || string() || null
*       status - string ('wait google authorization...') || ('done')
* */
router.post('/transaction',(req,res)=>{
    res.json({error:null,data:null});
});

/*
*   (6) Recieve Google data
*   parameters:
*       userId - string (user id)
*       gdata:
*           user - google user data
*           pass - google user pass
*   response:
*       error - null || string (Google error message)
*       data - null
* */
router.post('/googleAuth',(req,res)=>{
    res.json({error:null,data:null});
});
module.exports = router;