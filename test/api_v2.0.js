let request = require('supertest'),
    expect = require('chai').expect,
    monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.host+':'+config.db.port+'/'+config.db.dbName),
    user = require('../models/User'),
    app = require('../app');

describe('Testing cryptocoin api 2.0',()=>{

    it('Test genesis',(done)=>{
        request(app)
            .post('/api/v2.0/genesis')
            .set('Accept', 'application/json')
            .expect('Content-type', '/json/')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
    });
    it('Test message',(done)=>{
        request(app)
            .post('/api/v2.0/message')
            .set('Accept', 'application/json')
            .expect('Content-type', '/json/')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
    });
    it('Test account',(done)=>{
        request(app)
            .post('/api/v2.0/account')
            .set('Accept', 'application/json')
            .expect('Content-type', '/json/')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
    });
    it('Test config',(done)=>{
        request(app)
            .post('/api/v2.0/config')
            .set('Accept', 'application/json')
            .expect('Content-type', '/json/')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
    });
    it('Test transaction',(done)=>{
        request(app)
            .post('/api/v2.0/transaction')
            .set('Accept', 'application/json')
            .expect('Content-type', '/json/')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
    });
    it('Test googleAuth',(done)=>{
        request(app)
            .post('/api/v2.0/googleAuth')
            .set('Accept', 'application/json')
            .expect('Content-type', '/json/')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
    });

});
describe('getUserByPhone',()=>{
    it('phone',(done)=> {
        user.getUserByPhone('+380949506642', (data) => {
            console.dir(data);
            expect(data.data).to.equal(null);
            done();
        });
    });
    it('validate',(done)=> {
        let vf = user.validateData({message:'yzjQ'})
            console.log(vf);
            expect(vf).to.equal(true);
            done();
    });
});
describe('db test',()=>{
    it('find',(done)=>{
       // db.get('tmpUsers').find({message:'yzjQ'},(err,tmpUser)=>{
       //     console.dir(tmpUser[0].phone);
        //db.get('users').remove({'phone':'+380949506643'},()=>{});
       // db.get('users').insert({name:"null",phone:"+380"},(err,user)=>{
       //     console.log(user._id.toString());
       // });
        db.get('ethAccounts').update({"_id" : "59dbbf404e205c2eb1780a88"},{ "_id" : "59dbbf404e205c2eb1780a88", "user" : "59dbaad613247c274c33c95b", "address" : "0x56cb9adff6b442697b2eb912a73a618a5b3bea8a", "currency" : "ETH" });
            done();
      //  });
    });
});