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
        let vf = user.validateData({message:'yzjQ'});
            console.log(vf);
            expect(vf).to.equal(true);
            done();
    });
});
describe('db test',()=>{
    it('find',(done)=>{
        /*db.get('ethTransactions').find({to:'0x56cb9adff6b442697b2eb912a73a618a5b3bea8a'},{sort:{created_at:-1}}
        ,(err,tt)=>{
          console.dir(tt.map((t) => {
              return {
                  timestamp: t.created_at,
                  from: t.from,
                  to: t.to,
                  ammount: t.value
              }}));
          done();
        })*/
       // db.get('tmpUsers').find({message:'yzjQ'},(err,tmpUser)=>{
       //     console.dir(tmpUser[0].phone);
        //db.get('users').remove({'phone':'+380949506643'},()=>{});
       // db.get('users').insert({name:"null",phone:"+380"},(err,user)=>{
       //     console.log(user._id.toString());
       // });
       // db.get('ethAccounts').update({"_id" : "59dbbf404e205c2eb1780a88"},{ "_id" : "59dbbf404e205c2eb1780a88", "user" : "59dbaad613247c274c33c95b", "address" : "0x56cb9adff6b442697b2eb912a73a618a5b3bea8a", "currency" : "ETH" });
        /*client.setClient({name:'Test Client 2!',secret:'12347777'},(clt)=>{
            console.log('DONE!' + clt.client._id);
            console.dir(clt.client);
            console.log('Id '+clt.client._id);
            client.getClientById(clt.client._id,(cl)=>{
                console.dir(cl.client);
                done();
            })
        });*/
        //console.log(md5('kPtzIomGfFhUAuxKMjHCQGUCuYrMVlRR'));done();
       // user.getUserByParam({'phone':'+170949506641'},(u)=>{
            /*db.get('users').remove({'_id':{ }},(err,us)=>{*/
            //console.dir(er);
         /*   console.dir(u.data);
            u.data.pwd = 'pass';
            user.updatePhoneUser(u.data._id,u.data,(err,us)=> {
                console.log('ERR - ' + err);
                console.dir(us);
                done();
            });
        });*/
        /*user.setUser({
            name:'PHONE USER',
            phone:'+380949506644',
            created_at:Date.now(),
        },(err,usr)=>{
            console.log(err);
            console.dir(usr);
        })*/
        /*
        atoken.setToken({userId:'59dbaad613247c274c33c95b',
                            clientId:'59e0cbc1d5c98a2ee65b1a66',
                            token:'1234123456785678',
                            created_at: Date.now(),
        },(tkn)=>{
            console.log('DONE!' + tkn.token._id);
            console.dir(tkn.token);
            console.log('Id '+tkn.token._id);
            atoken.getTokenById(tkn.token._id,(tk)=>{
                console.dir(tk.token);
                done();
            })
        });*/
        /*db.get('ethTransactions').remove({$or:[{'to': '0x4336121081a46fd8b4de28bb02ae5b6fdca0168e'},
            {'from': '0x4336121081a46fd8b4de28bb02ae5b6fdca0168e'}]},(err)=>{
            console.dir(err);
            done();
        })*/

        let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        if(!web3.isConnected())
            console.log("not connected");
        else
            console.log("connected");
        let acc = new ETHAccounts(web3.currentProvider);
        let ac = acc.create();
        console.dir(ac);
        done();

      //  });
    });
});