let express = require('express'),
    config = require('../services/config'),
    User = require('../models/User'),
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
        res.resData.r = 0;
        res.json(res.resData);
    }
    else User.getUserByPhone(req.body.pn,(data)=> {
        if (data.error) {
            res.resData.r = 'Serever database error!';
            res.json(res.resData);
        } else {
            if (data.data) {
                res.resData.r = 1;
                res.json(res.resData);
            } else {

            }
        }
    })
});

router.post('/password',(req,res)=>{});
router.post('/oauth2',(req,res)=>{});

module.exports = router;