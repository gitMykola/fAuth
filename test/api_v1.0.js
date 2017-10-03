let request = require('supertest'),
    expect = require('chai').expect,
    app = require('../app');

describe('Testing cryptocoin api',()=>{
    it('Start testing...',(done)=>{setTimeout(()=>{done();},19000);});

    it('Test stat ETH-USD',(done)=>{
          request(app)
              .get('/api/v1.0/stat/BTC-USD')
              .set('Accept', 'application/json')
              .expect('Content-type', '/json/')
              .end(function (err, res) {
                  expect(res.status).to.equal(200);
                  expect(res.body).to.have.lengthOf(30);
                  done();
              });
    });
    it('Test stat BTC-USD',(done)=>{
            request(app)
                .get('/api/v1.0/stat/ETH-USD')
                .set('Accept', 'application/json')
                .expect('Content-type', '/json/')
                .end(function (err, res) {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.lengthOf(30);
                    done();
                });
    });
    //Nick id = 59cbd171dc2652236b1bbc29
    it('Test accounts',(done)=>{
        request(app)
            .get('/api/v1.0/accounts/59cbd171dc2652236b1bbc29')
            .set('Accept', 'application/json')
            .expect('Content-type', '/json/')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });
    //ETH account address 0x56cb9adff6b442697b2eb912a73a618a5b3bea8a
    it('Test ETH account transactions',(done)=>{
        request(app)
            .get('/api/v1.0/accounts/ETH/txcount/0x56cb9adff6b442697b2eb912a73a618a5b3bea8a')
            .set('Accept', 'application/json')
            .expect('Content-type', '/json/')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                expect(res.body.count).to.be.an('number');
                done();
            });
    });
});