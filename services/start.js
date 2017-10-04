module.exports = function (data){
    const { fork } = require('child_process');

    const refDB = fork('./services/refreshDB');//Don't forget set FULL PATH on PRODACTION!!!

    refDB.on('message', (msg) => {
        console.log('Message from child DB ', msg.counter);
        global.data = msg.counter;
    });

    const ref30 = fork('./services/refresh30Day');//Don't forget set FULL PATH on PRODACTION!!!
    global.data30 = {'BTC-USD':['Starting...'],
        'ETH-USD':['Starting...']};

    ref30.on('message', (msg) => {
        console.log('Message from child 30Day');
        if(msg.start)global.data30 = {'BTC-USD':[], 'ETH-USD':[]};
        else{
            global.data30[msg.pair].push(msg.data);
            global.data30[msg.pair].sort(function(a, b){return parseInt(b.time) - parseInt(a.time)});
        }
    });

    refDB.send('Start refresh DB.');
    setTimeout(()=>{ref30.send('Start refresh 30Day');},data.ref30DB);

};