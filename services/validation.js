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
        if(typeof(data) !== 'object' || data.length === 0) return {error:'Data incorrect!'};
        for(let ind in data)
        {
            if(!data.hasOwnProperty(ind) || typeof(data[ind]) !== 'string')
                return {error:'Data incorrect!'};
            switch (ind)
            {
                case 'pn':
                    if(!data[ind].match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g) || data[ind].length !== 13)
                        return {error:'pn'};
                    break;
                case 'on':
                    if(data[ind] !== '0' || data[ind] !== '1')
                        return {error:'on'};
                    break;
                case 'h1':
                    if(!net(data[ind]))
                        return {error:'h1'};
                    break;
                case 'p3':
                    if(data[ind].length > 15 || data[ind].length === 0 || !Boolean(Number(data[ind])))
                        return {error:'p3'};
                    break;
                case 'ul':
                    if(data[ind].length > 2 || data[ind] === 0 || data[ind] !== data[ind].toLowerCase())
                        return {error:'ul'};
                    break;
                case 'ph':
                    if(!data[ind].match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g) || data[ind].length !== 13)
                        return {error:'ph'};
                    break;
                case 'ss':
                    if(data[ind].length > 5 || data[ind].length === 0 || !Boolean(Number(data[ind])))
                        return {error:'ss'};
                    break;
                case 's':
                    if(data[ind].length > 15 || data[ind].length === 0)
                        return {error:'s'};
                    break;
                case 'p001':
                    if(data[ind].length > 8 || data[ind].length === 0)
                        return {error:'p001'};
                    break;
                case 'sp':
                    if(data[ind].length > 15 || data[ind].length === 0)
                        return {error:'sp'};
                    break;
                default:
                    return {error:'Unknown data field!'};
                    break;
            }
        }
        return {error:null};
    },
};