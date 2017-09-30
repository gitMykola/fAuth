# Crypto currencies api 
#
####   Dependencies:

    node version 8.4.0, 
    npm version 5.3.0,
    body-parser ~1.17.1,
    cookie-parser ~1.4.3,
    debug ~2.6.3,
    express ~4.15.2,
    jade ~1.11.0,
    morgan ~1.8.1,
    node-compass ^0.2.3,
    serve-favicon ~2.4.2,
    xmlhttprequest ^1.8.0
    web3 0.19.0
    
# 
    Test url http://profee.club/
###   Api:
    /api/v1.0/{:pair}
    Close price for last 30 days
    Example: GET request to http://profee.club/api/v1.0/BTC-USD
    response:
      error = Strimg || null,
      data  = JSON Array(...{
            date = YYYY-MM-DD,
            priceClose = Decimal,
            hour = if close price differency more then 3% beetwin current and previos days
                JSON Array(...{date = YYYY-MM-DD,
                priceClose = Decimal}...)
            else null
        	}...) || null.
###   Currencies pairs:
    BTC-USD
    ETH-USD
###	description:
    There're crypto currencies rates provider class RatesProvider(/providers/RatesProvider.js) where You can find marketsToDB(). This func() without any arguments and main action of this one is a reading via ajax requests some brokers(like GDAX and others) api to input crypto currency rates history. For example GDAX market has module export func() 
    (/services/gdax.js) who's named like market_1(...) and has 4 params(pair - currency pair like 'ETH-USD', period - now Day like D1 or Hour like H1, useing it to set time interval for market request and database collection to save history data, time - timestamp to determine subinterval for market request, next - callback func() to process requesting data).<br>
    MongoDB database used in this project. 'crypto' database and two collections 'D1' and 'H1' where stored days and hours data. There're some fields: _id - database unique Object, pair - currency pair, time - timestamp of data, open/close/high/low - OCHL like market model data, price fields and market - name of source data market.
    In app.js started two child processes(refDB and ref30 './services/refreshDB.js' and './services/refresh30Day.js') via fork (node module 'child_process'). refDB used RatesProvider via marketToDB() to database history data inputs and there're setting up time interval to make it sometimes. The same time schem apply with ref30 process to refresh data into global object variable global.data where setting up currency pairs arrays. Application use global.data object to send request data as JSON array.

####    Resources:
    https://ropsten.etherscan.io/
    https://etherscan.io/
    https://www.gitbook.com/@ethereumbuilders
    https://web3js.readthedocs.io/en/1.0/web3.html
    https://ethereum.stackexchange.com/
    https://support.kraken.com/hc/en-us
    https://docs.gdax.com/
    http://faucet.ropsten.be 
    https://sebs.github.io/etherscan-api/
    
    for next reseaching
    http://ru.bitcoinwiki.org
    http://ipfs.io
    http://bit.ly/ipfs-whitepaper
    http://filecoin.io
    https://storj.io
    https://github.com/maidsafe/Whitepapers/blob/master/Project-Safe.md
    https://litecoin.com
    https://bitcoin.org
    https://counterparty.io
    https://www.hyperledger.org
    https://github.com/bitpay/bitauth
    https://openid.net
    http://www.namecoin.info
    https://nameid.org
    https://github.com/ipfs/astralboot //Alternative to Ethereun VM
    /* Ни Ethereum,
      ни Bitcoin не способны запрашивать данные за пределами
      самих себя. Это ограничение реализовано намеренно, с це-
      лью безопасности.*/
    http://gocircuit.github.io/circuit
    https://opengarden.com
    http://mercuryex.com  
    