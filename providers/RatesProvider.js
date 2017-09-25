let XHR = require('xmlhttprequest').XMLHttpRequest,
    monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.host+':'+config.db.port+'/'+config.db.dbName),
    market_1 = require('../markets/gdax');

module.exports = class RatesProvider{
    RatesProvider(){
        console.log('Initialized ' + this.constructor.name);
    };
    static get(url){
        return new Promise((resolve, reject) => {
            const req = new XHR();
            req.open('GET', url);
            req.onload = () => req.status === 200 ? resolve(req.responseText) : reject(console.dir(req.statusText));
            req.onerror = (e) => reject(console.dir(`Network Error: ${e}`));
            req.send();
        });
    };
    static set30Days(res){};
    static getRates(pair, next){
        //console.log('API request processing...');
        const options = {
            "limit":30,

        };
        const collection = db.get('D1');
        const date = new Date();
        //collection.find({},{time:{$lte:date.valueOf(), $gte:(date.valueOf() + 60*60*24*30*1000)}})
        collection.find({},["time","close",options])
            .then((result)=>{
                let data = result.map((days)=>{
                    return {time:days.time,price:days.close};
                    });
                for(let i = 1;i < data.length;i++)
                {
                    //if
                }
                next(data);
            });
    };
    static getRatesToDB(pair, next){
        console.log('processing...');
        let dateFinish = new Date();
        let dateStart = new Date(dateFinish - 60*60*24*30*1000);
        dateFinish = dateFinish.getFullYear() + '-' + (dateFinish.getMonth() + 1) + '-' + dateFinish.getDate();
        dateStart = dateStart.getFullYear() + '-' + (dateStart.getMonth() + 1) + '-' + dateStart.getDate();
        const url = 'https://api.gdax.com/products/'+pair+'/candles?start="'+dateStart+'"&end="'+dateFinish+'"&granularity=86400';
        console.log(url);
        this.get(url)
            .then((response)=>{
                let data = {data: JSON.parse(response),error: null};
                data.data = data.data.map(function(el){
                    let date = new Date(el[0]*1000);
                    date = date.getFullYear() +'-'+ (date.getMonth() + 1) +'-'+ date.getDate();
                    return {date: date,priceClose: el[4]};});
                //res.json(data);
                console.log(data.data[0]);
            }, (reject)=>{
                console.log('GDAX Error.');//https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=30&aggregate=1
                res.json({error: "Market Error.",data: null});
            });
    }
    static marketsToDB(){
        console.log('markets to DB ...');
        let pair = 'BTC-USD';
        market_1(pair,'D1', 0,(result,err) => {
            if(err)console.log(err);
            else {
                const data = result.data;
                const br = data.length > 30?30:data.length;
                const collection = db.get('D1');
                for(let i = 0;i < br; i++) {
                    collection.findOne({pair:data[i].pair,
                                        time: data[i].time,
                                        market: data[i].market})
                        .then((resl) => {
                        if (resl) {}//console.log(resl._id.toString());
                        else collection.insert(data[i]).then((r) => {
                            console.log(r);
                        });
                    });
                }

                for(let i = 0;i < br; i++)
                    {
                        //if(1 || data[i].close * 0.03 < Math.abs(data[i-1].close - data[i].close))
                        //{
                            let waitTill = new Date(new Date().getTime() + 500);
                            while(waitTill > new Date()){}

                            market_1(pair,'H1', data[i].time,(result,err)=>{
                                if(err)console.log(err);
                                else{
                                    const h1Data = result.data;
                                    console.log(i+' '+h1Data.length);
                                    const h1Collection = db.get('H1');
                                    for(let i = 0;i < h1Data.length; i++)
                                    {
                                        h1Collection.findOne({pair:h1Data[i].pair,
                                                                time: h1Data[i].time,
                                                                market: h1Data[i].market})
                                            .then((resl) => {
                                            if (resl) {}//console.log(resl._id.toString());
                                            else h1Collection.insert(h1Data[i]).then((r) => {
                                                console.log(r);
                                            });
                                        });
                                    }

                                    //console.log(result.data);
                                }
                            });
                            console.log(data[i].close + ' ' + data[i+1].close
                                + ' ' + Math.round(Math.abs(data[i+1].close - data[i].close))
                                + ' ' + Math.round(data[i].close * 0.03));
                            console.log(new Date(data[i].time*1000));
                            console.log(' '+i);
                        //}

                    }
                }
            });
        pair = 'ETH-USD';
        market_1(pair,'D1', 0,(result,err) => {
            if(err)console.log(err);
            else {
                const data = result.data;
                const br = data.length > 30?30:data.length;
                const collection = db.get('D1');
                for(let i = 0;i < br; i++) {
                    collection.findOne({pair:data[i].pair,
                        time: data[i].time,
                        market: data[i].market})
                        .then((resl) => {
                            if (resl) {}//console.log(resl._id.toString());
                            else collection.insert(data[i]).then((r) => {
                                console.log(r);
                            });
                        });
                }

                for(let i = 0;i < br; i++)
                {
                    //if(1 || data[i].close * 0.03 < Math.abs(data[i-1].close - data[i].close))
                    //{
                    let waitTill = new Date(new Date().getTime() + 500);
                    while(waitTill > new Date()){}

                    market_1(pair,'H1', data[i].time,(result,err)=>{
                        if(err)console.log(err);
                        else{
                            const h1Data = result.data;
                            console.log(i+' '+h1Data.length);
                            const h1Collection = db.get('H1');
                            for(let i = 0;i < h1Data.length; i++)
                            {
                                h1Collection.findOne({pair:h1Data[i].pair,
                                    time: h1Data[i].time,
                                    market: h1Data[i].market})
                                    .then((resl) => {
                                        if (resl) {}//console.log(resl._id.toString());
                                        else h1Collection.insert(h1Data[i]).then((r) => {
                                            console.log(r);
                                        });
                                    });
                            }

                            //console.log(result.data);
                        }
                    });
                    console.log(data[i].close + ' ' + data[i+1].close
                        + ' ' + Math.round(Math.abs(data[i+1].close - data[i].close))
                        + ' ' + Math.round(data[i].close * 0.03));
                    console.log(new Date(data[i].time*1000));
                    console.log(' '+i);
                    //}

                }
            }
        });
    };
};