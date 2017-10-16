let express = require('express'),
    mongo = require('mongodb'),
    monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.host+':'+config.db.port+'/'+config.db.dbName),
    cryptor = require('crypto'),
    rnd = require('randomstring'),
    net = require('net');

module.exports = {
    format:function(data){
        if(typeof(data) !== 'object' || data.length === 0) return 'Data incorrect!';
        for(let ind in data)
        {console.dir(typeof(data));
            if(!data[ind] || typeof(data[ind]) !== 'string')
                return 'Data incorrect!';
            switch (ind)
            {
                case 'pn':
                    if(!data[ind].match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g) || data[ind].length !== 13)
                        return 'pn';
                    break;
                case 'on':
                    if(data[ind].toString() !== '0' && data[ind].toString() !== '1')
                        return 'on';
                    break;
                case 'h1':
                    if(!net.isIP(data[ind]))
                        return 'h1';
                    break;
                case 'p3':
                    if(data[ind].length !== 15 || !Boolean(Number(data[ind])))
                        return 'p3';
                    break;
                case 'ul':
                    if(data[ind].length !== 2 || data[ind] !== data[ind].toLowerCase())
                        return 'ul';
                    break;
                case 'ph':
                    if(!data[ind].match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g) || data[ind].length !== 13)
                        return 'ph';
                    break;
                case 'ss':
                    if(data[ind].length !== 5 || !Boolean(Number(data[ind])))
                        return 'ss';
                    break;
                case 's':
                    if(data[ind].length !== 32)
                        return 's';
                    break;
                case 'p001':
                    if(data[ind].length !== 8)
                        return 'p001';
                    break;
                case 'sp':
                    if(data[ind].length !== 15)
                        return 'sp';
                    break;
                default:
                    return 'Unknown data field!';
                    break;
            }
        }
        return null;
    },
    rndNumber:function(cnt){
        let rndNum = '';
        for (let i = 0; i < cnt;i++)
            rndNum += Math.round(Math.random()*10).toString();
        return rndNum;
    },
};