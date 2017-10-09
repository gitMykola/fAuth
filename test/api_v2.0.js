let request = require('supertest'),
    expect = require('chai').expect,
    app = require('../app');

describe('Testing cryptocoin api 2.0',()=>{

    it('Test genesis',(done)=>{
        request(app)
            .get('/api/v2.0/genesis')
            .set('Accept', 'application/json')
            .expect('Content-type', '/json/')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
    });
    it('Test message',(done)=>{
        request(app)
            .get('/api/v2.0/message')
            .set('Accept', 'application/json')
            .expect('Content-type', '/json/')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
    });
    it('Test account',(done)=>{
        request(app)
            .get('/api/v2.0/account')
            .set('Accept', 'application/json')
            .expect('Content-type', '/json/')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
    });
    it('Test config',(done)=>{
        request(app)
            .get('/api/v2.0/config')
            .set('Accept', 'application/json')
            .expect('Content-type', '/json/')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
    });
    it('Test transaction',(done)=>{
        request(app)
            .get('/api/v2.0/transaction')
            .set('Accept', 'application/json')
            .expect('Content-type', '/json/')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
    });
    it('Test googleAuth',(done)=>{
        request(app)
            .get('/api/v2.0/googleAuth')
            .set('Accept', 'application/json')
            .expect('Content-type', '/json/')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
    });

});