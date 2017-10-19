module.exports = {
    db:{
        host:'localhost',
        port:'27017',
        dbName:'crypto',
        user:'root',
        pwd:'',
    },
    app:{
        host:'http://localhost:3000',
        name:'cryptoApi',
        privateKey:'23gqwSE8vD)(*$J',
        cookieLife:1000*60*60*24*7,
        refresh30:1000*60*60*24,
        refreshDB:1000*60*60*24,
        ref30DB:1000*60*5,
        tokenLive:60*60,
        tmpUserLive:60*30*1000,
    },
    currencies:[
        'BTC',
        'ETH'
    ],
    pairs:[
        'BTC-USD','BTC-EUR',
        'ETH-USD','ETH-EUR'
    ],
    crypt:{
            date:'10.01.2017',
            keyLen:256,
            saltLen:32,
            alg:'sha256',
            et:1000,
        },
    routes:{
        'c1':config.app.host + '/api/v3.0/phonevalid',
        'c2':config.app.host + '/api/v3.0/smsconfirm',
        'c3':config.app.host + '/api/v3.0/password',
        'c4':config.app.host + '/api/v3.0/auth',
        'c5':config.app.host + '/api/v3.0/googletoken',
        'c6':config.app.host + '/api/v3.0/send',
        'c7':config.app.host + '/api/v3.0/contacts',
    },
};