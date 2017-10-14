let express = require('express'),
    config = require('../services/config'),
    User = require('../models/User'),
    md5 = require('js-md5'),
    router = express.Router();
/*
* @body:{
*           pn: +380931311333
                  (PhoneNumber),
            on: 1,
            h1: 144.11.3.12
                    (IP),
            p3: 8679300256755
                    IMEI,
            ul: ru en (etc),
*       }
* */
router.post('/phonevalid',(req,res)=>{
    res.resData = {r:null,r1:{k1:null,u1:null}};
    if(!User.validateData({phone:req.body.pn})) {
        res.resData.r = 0;
        res.json(res.resData);
    }
    else User.getUserByPhone(req.body.pn,(data)=>{
        if(data.error){
            res.resData.r = 'Serever database error!';
            res.json(res.resData);
        }else{
            if(data.data){
                res.resData.r = 1;
                res.json(res.resData);
            }else{
                User.getTmpUserByPhone(req.body.pn,(tmpData)=> {
                    if(tmpData.error){
                        res.resData.r = 'Serever database error!';
                        res.json(res.resData);
                    }else {
                        if(tmpData.data){
                            res.resData.r = 1;
                            res.json(res.resData);
                        }else {
                            let tmpUser = {
                                name: 'PHONE USER',
                                phone: req.body.pn,
                            };
                            User.setTempUser(tmpUser, (ms) => {
                                if (ms.error) {
                                    res.resData.r = 'Serever database error!';
                                    res.json(res.resData);
                                } else {
                                    res.resData.r1.k1 = ms.data;
                                    res.resData.r1.u1 = ms.u1;
                                    res.json(res.resData);
                                }
                            })
                        }
                    }
                })
            }
        }
    })
});
/*
* OEIww
* 59e22584159fe127acf1a8e7
* md5() = b870da30902ff5c9a433c19aab2cfc32
*         b870da30902ff5c9a433c19aab2cfc32
*
* @body:{
*           ph: -
*           ss: -
*           s:  -
*        }
*
* */
router.post('/smsconfirm',(req,res)=>{
    res.resData = {rs:null,rs1:{us1:null}};
    if(!User.validateData({phone:req.body.pn})) {
        res.resData.rs = 0;
        res.json(res.resData);
    }
    else User.getUserByPhone(req.body.ph,(data)=> {
        if (data.error) {
            res.resData.rs = 'Serever database error!';
            res.json(res.resData);
        } else {
            if (data.data) {
                res.resData.rs = 1;
                res.json(res.resData);
            } else {
                User.getTmpUserByPhone(req.body.ph,(tmpUser)=>{
                    if(tmpUser.error){
                        res.resData.rs = 'Serever database error!';
                        res.json(res.resData);
                    }else if(!tmpUser.data){
                            res.resData.rs = 2;
                            res.json(res.resData);
                        }else if(req.body.ss !== tmpUser.data.message){
                            res.resData.rs = 3;
                            res.json(res.resData);
                                }else if(req.body.s !== md5(tmpUser.data._id.toString())){
                                            res.resData.rs = 4;
                                            res.json(res.resData);
                                        }else if((Date.now() - tmpUser.data.created_at) > config.app.tmpUserLive){
                                    console.log((Date.now() - tmpUser.data.created_at));
                                                    res.resData.rs = 5;
                                                    res.json(res.resData);
                                                }else User.setUser({
                                                            name:'PHONE USER',
                                                            phone:tmpUser.data.phone,
                                                            created_at:Date.now(),
                                                                    },(err,staticUser)=>{
                                                        if(err){
                                                            res.resData.rs = 'Server Database error!!';
                                                            res.json(res.resData);
                                                        }else{
                                                            User.deleteTmpUser(tmpUser.data._id.toString(),(err)=>{
                                                                if(err){
                                                                    res.resData.rs = 'Server Database error!';
                                                                    res.json(res.resData);
                                                                }else{
                                                                    res.resData.rs1.us1 = staticUser._id.toString();
                                                                    res.json(res.resData);
                                                                }
                                                            })
                                                        }
                                                    });
                })
            }
        }
    })
});
//
router.post('/password',(req,res)=>{});
router.post('/oauth2',(req,res)=>{});

module.exports = router;