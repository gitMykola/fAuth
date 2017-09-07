let express = require('express'),
    provider = new require('../providers/CurrencyInfoProvider');

module.exports =
    {
        getHystory: function(period,res)
        {
            provider.get('http://www.coincap.io/history/'+ period +'/BTC').then((response)=>{
                let data = JSON.parse(response).price;
                data = data.map(function(el){
                    return {x:new Date(el[0]),y:el[1]};
                });
                console.dir(data);
                res.send(data);
            });
        }
    }