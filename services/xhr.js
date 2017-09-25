let xhr = require('xmlhttprequest').XMLHttpRequest;

module.exports = class XHR{
    static get(url){
        return new Promise((resolve, reject) => {
            const req = new xhr();
            req.open('GET', url);
            req.onload = () => req.status === 200 ? resolve(req.responseText) : reject(console.dir(req.statusText));
            req.onerror = (e) => reject(console.dir(`Network Error: ${e}`));
            req.send();
        });
    };
}