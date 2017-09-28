let Web3 = require('web3'); // Stabile version web3@0.19.0 !!!!!!!!!!!!!!!!!!!!!!!!!!
    //acc = require('web3-eth-accounts');

module.exports = {
    new:(data, next)=> {
        let web3;
        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }
        //console.dir(web3.has ('isConnected'));
        if(web3.isConnected !== 'undefined' && !web3.isConnected())
        {
            console.log("ETH NET not connected!");
            next({data:null});
        }
        console.log("connected");
        //web3.eth.getAccounts().then((err,acc)=>{if(err)console.dir(err);else console.dir(acc)});
        //let account = new
        //console.dir(web3.eth.getBalance('0x8ae4f5a1f71b52ccedcaa6df3c17dd4a5341ab7d'));
        web3.eth.getBalance('0x8ae4f5a1f71b52ccedcaa6df3c17dd4a5341ab7d',(err,result)=>{console.dir(result)});
        console.dir(web3.eth.blockNumber.toString());
        next({
             data: {
                  address: '12345678',
                  currency: data.currency,
                  userId: data.userId
                  }
             });
    },
};