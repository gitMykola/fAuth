let XHR = require('xmlhttprequest').XMLHttpRequest;
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
    static getRates(res, pair, next){
        let dateFinish = new Date();
        let dateStart = new Date(dateFinish - 60*60*24*30*1000);
        dateFinish = dateFinish.getFullYear() + '-' + (dateFinish.getMonth() + 1) + '-' + dateFinish.getDate();
        dateStart = dateStart.getFullYear() + '-' + (dateStart.getMonth() + 1) + '-' + dateStart.getDate();
        const url = 'https://api.gdax.com/products/'+pair+'/candles?start="'+dateStart+'"&end="'+dateFinish+'"&granularity=86400';
        this.get(url)
            .then((response)=>{
                let data = {data: JSON.parse(response),error: null};
                data.data = data.data.map(function(el){
                    let date = new Date(el[0]*1000);
                    date = date.getFullYear() +'-'+ (date.getMonth() + 1) +'-'+ date.getDate();
                    return {date: date,priceClose: el[4]};});
            res.json(data);
            }, (reject)=>{
            console.log('GDAX Error.');//https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=30&aggregate=1
            res.json({error: "Market Error.",data: null});
            });
    };
}