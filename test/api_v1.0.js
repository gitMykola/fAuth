let request = require('supertest'),
    expect = require('chai').expect,
    app = require('../app');

describe('Testing cryptocoin api',()=>{
    setTimeout(()=>{
    it('Test stat',(done)=>{
        request(app)
            .get('/api/v1.0/stat/ETH-USD')
            .set('Accept', 'application/json')
            .expect('Content-type', '/json/')
            //.expect(200, done);
            .end(function(err,res){
                expect(res.status).to.equal(200);
                expect(res.body).to.have.lengthOf(30);
                done();
            });
    });},60*1000);
    //describe('accounts');
});