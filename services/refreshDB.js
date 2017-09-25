let monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.host+':'+config.db.port+'/'+config.db.dbName),
    market_1 = require('../markets/gdax'),
    provider = new require('../providers/RatesProvider');

process.on('message', (msg) => {
    console.log('Message from parent:', msg);
    start();
});

let counter = 0;

//setInterval(() => {
function start(){
    process.send({ counter: counter++ });
    provider.marketsToDB();
}//, 60*60*24*1000);