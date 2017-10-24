let monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.url),
    market_1 = require('../markets/gdax'),
    provider = new require('../providers/RatesProvider');

process.on('message', (msg) => {
    console.log('Message from parent:', msg);
    start();

});

let counter = 0;

let fn = function(){
        setTimeout(()=>{
            start();
            fn();
        },config.app.refreshDB);
    };
fn();

function start(){
    process.send({ counter: counter++ });
    provider.marketsToDB();
}