let monk = require('monk'),
    //config = require('../services/config'),
    db = monk(global.config.db.host+':'+global.config.db.port+'/'+global.config.db.dbName),
    market_1 = require('../markets/gdax'),
    provider = new require('../providers/RatesProvider');

process.on('message', (msg) => {
    console.log('Message from parent:', msg);
    start();

});

let counter = 0;

for(let i = 1;i < global.config.app.refNum;i++)
  setInterval(() => start(), global.config.app.refreshDB * i);

function start(){
    process.send({ counter: counter++ });
    provider.marketsToDB();
}