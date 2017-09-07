/**
 * Created by Nick on 25.08.2017.
 */
let XHR = require('xmlhttprequest').XMLHttpRequest;
module.exports = class CurrencyInfoProvider{
    //CACHE_TIMEOUT = 1000 * 60 * 20; // cache txs for 20 minutes
    CurrencyInfoProvider(){
        this.lastUpdatedTimestamp = 0;
        console.log('Initialized ' + this.constructor.name);
    };
    static get(url){
        return new Promise((resolve, reject) => {
            const req = new XHR();
            req.open('GET', url);
            req.onload = () => req.status === 200 ? resolve(req.responseText) : reject(Error(req.statusText));
            req.onerror = (e) => reject(Error(`Network Error: ${e}`));
            req.send();
        });
    };
    getLastTransactions(callback) {
    };
}
