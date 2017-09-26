let monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.host+':'+config.db.port+'/'+config.db.dbName),
    market_1 = require('../markets/gdax');

process.on('message', (msg) => {
    console.log('Message from parent:', msg);
    start();
});

let counter = 0;

setInterval(() => start(),60*60*24*1000);
function start(){
    process.send({start:true});
    counter++;
    console.log('Starting ' + counter);
    const collection = db.get('D1');
    const date = new Date();
    let pair = 'BTC-USD';
    collection.find({pair:pair},{time:{$gte:0},
                        close:{$gte:0},
                        sort:{time:-1},
                        limit:30})
        .then((result)=>{
            let data = result.map((days)=>{
                return {time:days.time,
                        price: days.close,
                        hour:null};
            });

            //for(let i = 0; i < data.length; i++)console.log(i+' '+new Date(data[i].time*1000)+' '+data[i].price);
            //data.sort((a ,b)=>{return (a.time - b.time > 0)});
            for(let i = 0;i < data.length - 1;i++) {
                //console.log(data[i-1].price + '  ' +data[i].price + '  ' + data[i].price * 0.03 +' '+ Math.abs(data[i].price - data[i - 1].price));
                if (data[i].price * 0.03 < Math.abs(data[i].price - data[i + 1].price)) {
                    data[i].hour = true;
                    const h1Collection = db.get('H1');
                    console.log(data[i + 1].price + '  ' +data[i].price
                        + '  ' + data[i].price * 0.03
                        +' '+ Math.abs(data[i].price - data[i + 1].price));
                    h1Collection.find({pair:pair,
                                        time:{$gte:data[i].time,$lte:data[i].time + 60*60*23},
                                        close:{$gte:0}},
                                        {sort:{time:-1}})
                        .then((result,err)=>{
                        if(err){
                            process.send({pair:pair, data:data[i]});
                            console.log("Error " + err);
                        }
                        else{

                        data[i].hour = result.map(function(el){
                            return {time: el.time, price: el.close};
                        });
                        process.send({pair:pair, data:data[i]});
                        }
                        });
                }else process.send({pair:pair, data:data[i]});
            }
            process.send({pair:pair, data:data[data.length - 1]});
        });
    let pair2 = 'ETH-USD';
    collection.find({pair:pair2},{time:{$gte:0},
        close:{$gte:0},
        sort:{time:-1},
        limit:30})
        .then((result)=>{
            let data = result.map((days)=>{
                return {time:days.time,
                    price: days.close,
                    hour:null};
            });

            for(let i = 0;i < data.length - 1;i++) {
                //console.log(data[i-1].price + '  ' +data[i].price + '  ' + data[i].price * 0.03 +' '+ Math.abs(data[i].price - data[i - 1].price));
                if (data[i].price * 0.03 < Math.abs(data[i].price - data[i + 1].price)) {
                    data[i].hour = true;
                    const h1Collection = db.get('H1');
                    console.log(data[i + 1].price + '  ' +data[i].price
                        + '  ' + data[i].price * 0.03
                        +' '+ Math.abs(data[i].price - data[i + 1].price));
                    h1Collection.find({pair:pair2,
                            time:{$gte:data[i].time,$lte:data[i].time + 60*60*23},
                            close:{$gte:0}},
                        {sort:{time:-1}})
                        .then((result,err)=>{
                            if(err){
                                process.send({pair:pair2, data:data[i]});
                                console.log("Error " + err);
                            }
                            else{

                                data[i].hour = result.map(function(el){
                                    return {time: el.time, price: el.close};
                                });
                                process.send({pair:pair2, data:data[i]});
                            }
                        });
                }else process.send({pair:pair2, data:data[i]});
            }
            process.send({pair:pair2, data:data[data.length - 1]});
        });
};