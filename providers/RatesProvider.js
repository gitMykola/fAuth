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
                            //console.log(r);
                        });
                    });
                }

                for(let i = 0;i < br; i++)
                    {
                        //if(1 || data[i].close * 0.03 < Math.abs(data[i-1].close - data[i].close))
                        //{
                            let waitTill = new Date(new Date().getTime() + 1000);
                            while(waitTill > new Date()){}

                            market_1(pair,'H1', data[i].time,(result,err)=>{
                                if(err)console.log(err);
                                else{
                                    const h1Data = result.data;
                                    console.log(i+' '+h1Data.length +' hours');
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
                            /*console.log(data[i].close + ' ' + data[i+1].close
                                + ' ' + Math.round(Math.abs(data[i+1].close - data[i].close))
                                + ' ' + Math.round(data[i].close * 0.03));*/
                            console.log(new Date(data[i].time*1000));
                            console.log(' '+i);
                        //}

                    }
                }
            });
        let pair2 = 'ETH-USD';
        market_1(pair2,'D1', 0,(result,err) => {
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
                                //console.log(r);
                            });
                        });
                }

                for(let i = 0;i < br; i++)
                {
                    //if(1 || data[i].close * 0.03 < Math.abs(data[i-1].close - data[i].close))
                    //{
                    let waitTill = new Date(new Date().getTime() + 500);
                    while(waitTill > new Date()){}

                    market_1(pair2,'H1', data[i].time,(result,err)=>{
                        if(err)console.log(err);
                        else{
                            const h1Data = result.data;
                            console.log(i+' '+h1Data.length + ' hours');
                            const h1Collection = db.get('H1');
                            for(let i = 0;i < h1Data.length; i++)
                            {
                                h1Collection.findOne({pair:h1Data[i].pair,
                                    time: h1Data[i].time,
                                    market: h1Data[i].market})
                                    .then((resl) => {
                                        if (resl) {}//console.log(resl._id.toString());
                                        else h1Collection.insert(h1Data[i]).then((r) => {
                                            //console.log(r);
                                        });
                                    });
                            }

                            //console.log(result.data);
                        }
                    });
                    //console.log(data[i].close + ' ' + data[i+1].close
                    //    + ' ' + Math.round(Math.abs(data[i+1].close - data[i].close))
                    //    + ' ' + Math.round(data[i].close * 0.03));
                    console.log(new Date(data[i].time*1000));
                    console.log(' '+i);
                    //}

                }
            }
        });
    };
};