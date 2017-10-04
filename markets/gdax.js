let xhr = require('../services/xhr');

module.exports = function (pair, period, time, next) {
    let granularity = '',
        dateFinish = new Date(),
        dateStart = new Date();
    switch(period){
        case'D1':
            {
                console.log('GDAX D1 processing...');
                //aconsole.dir(this);
                dateStart = new Date(dateFinish - 60 * 60 * 24 * 2  * 1000);
                granularity = '86400';
                break;
            }
        case'H1':
            {
                console.log('GDAX H1 processing...');
                dateStart = new Date(time * 1000);
                dateFinish = new Date(dateStart.valueOf() + 60 * 60 * 23 * 1000);
                granularity = '3600';
                break;
            }
        default:next(result = null, err = 'GDAX Error!..');
    }
    dateFinish = dateFinish.getFullYear() + '-' + (dateFinish.getMonth() + 1) + '-' + dateFinish.getDate();
    dateStart = dateStart.getFullYear() + '-' + (dateStart.getMonth() + 1) + '-' + dateStart.getDate();
    const url = 'https://api.gdax.com/products/' + pair + '/candles?start="' + dateStart + '"&end="' + dateFinish + '"&granularity='+granularity;
    console.log(url);
    //setTimeout(()=> {
        xhr.get(url)
            .then((response) => {
                let data = {data: JSON.parse(response), error: null};
                data.data = data.data.map(function (el) {
                    return {
                        pair: pair,
                        time: el[0],
                        open: el[3],
                        close: el[4],
                        high: el[2],
                        low: el[1],
                        market: 'GDAX'
                    };
                });
                next(result = data, err = null);
            }, (reject) => next(result = null, err = 'GDAX Error!.'));
        //},1000*20);

};