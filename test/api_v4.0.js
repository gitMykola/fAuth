let request = require('supertest'),
    expect = require('chai').expect,
    monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.url),
    user = require('../models/User'),
    client = require('../models/Client'),
    atoken = require('../models/AccessToken'),
    rtoken = require('../models/RefreshToken'),
    app = require('../app'),
    md5 = require('js-md5'),
    ETHAccounts = require('web3-eth-accounts'),
    Web3 = require('web3');

describe('Testing cryptocoin api 4.0',()=>{
    it('ETHAccount',(done)=>{
        let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        if(!web3.isConnected())
            console.log("not connected");
        else
            console.log("connected");
        let acc = new ETHAccounts(web3.currentProvider);
        let ac = acc.create();
        console.dir(ac);
        done();
    });
});