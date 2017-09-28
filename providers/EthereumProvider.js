let Web3 = require('web3');

module.exports = {
    new:(data, next)=> {
       /* if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }
        if(!web3.isConnected())
            console.log("not connected");
        else
            console.log("connected");*/
        next({data:{address:'12345678',
            currency: data.currency,
            userId:data.userId,
            pas:data.passfrase}});
    },
};