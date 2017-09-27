let xhr = require('../services/xhr');

module.exports = function (pair, period, time, next) {
        switch(period){
            case 'D1': {
                console.log('GDAX D1 processing...');
                let dateFinish = new Date();
                let dateStart = new Date(dateFinish - 60 * 60 * 24 * 30  * 1000);
                dateFinish = dateFinish.getFullYear() + '-' + (dateFinish.getMonth() + 1) + '-' + dateFinish.getDate();
                dateStart = dateStart.getFullYear() + '-' + (dateStart.getMonth() + 1) + '-' + dateStart.getDate();
                const url = 'https://api.gdax.com/products/' + pair + '/candles?start="' + dateStart + '"&end="' + dateFinish + '"&granularity=86400';
                console.log(url);
                xhr.get(url)
                    .then((response) => {
                        let data = {data: JSON.parse(response), error: null};
                        data.data = data.data.map(function (el) {
                            return {pair: pair,
                                time: el[0],
                                open: el[3],
                                close: el[4],
                                high: el[2],
                                low: el[1],
                                market: 'GDAX'};
                        });
                        next(result = data, err = null);
                    }, (reject) => next(result = null, err = 'GDAX Error!..'));
                break;
            }
            case 'H1': {
                    console.log('GDAX H1 processing...');
                    let dateStart = new Date(time * 1000);
                    let dateFinish = new Date(dateStart.valueOf() + 60 * 60 * 23 * 1000);
                    dateFinish = dateFinish.getFullYear() + '-' + (dateFinish.getMonth() + 1) + '-' + dateFinish.getDate();
                    dateStart = dateStart.getFullYear() + '-' + (dateStart.getMonth() + 1) + '-' + dateStart.getDate();
                    const url = 'https://api.gdax.com/products/' + pair + '/candles?start="' + dateStart + '"&end="' + dateFinish + '"&granularity=3600';
                    console.log(url);
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
                        }, (reject) => {

                            next(result = null, err = 'GDAX Error!.');
                        });
                break;
            }
            default:
                console.log('GDAX Error!...');
                next(result = null, err = 'GDAX Error!....');
        }
};