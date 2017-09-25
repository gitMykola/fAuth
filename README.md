# Crypto currencies api 
#
#   Dependencies:
    node version 8.4.0, 
    npm version 5.3.0,
    "body-parser": "~1.17.1",
    "cookie-parser": "~1.4.3",
    "debug": "~2.6.3",
    "express": "~4.15.2",
    "jade": "~1.11.0",
    "morgan": "~1.8.1",
    "node-compass": "^0.2.3",
    "serve-favicon": "~2.4.2",
    "xmlhttprequest": "^1.8.0"
    
# 
    Test url http://profee.club/
#   Api:
/api/v1.0/{:pair}<br>
    Close price for last 30 days<br>
    Example: GET request to http://profee.club/api/v1.0/BTC-USD<br>
    response:<br>
      error = Strimg || null,<br>
      data  = JSON Array(...{<br>
            date = YYYY-MM-DD,<br>
            priceClose = Decimal,<br>
            hour = if close price differency more then 3% beetwin current and previos days <br>
                JSON Array(...{date = YYYY-MM-DD,<br>
                priceClose = Decimal}...)<br>
            else null<br>
        	}...) || null.<br>
#   Currencies pairs:
BTC-USD<br>
ETH-USD<br>
#	description:
There're crypto currencies rates provider class RatesProvider(/providers/RatesProvider.js) where You can find marketsToDB(). This func() without any arguments and main action of this one is a reading via ajax requests some brokers(like GDAX and others) api to input crypto currency rates history. For example GDAX market has module export func() 
(/services/gdax.js) who's named like market_1(...) and has 4 params(pair - currency pair like 'ETH-USD', period - now Day like D1 or Hour like H1, useing it to set time interval for market request and database collection to save history data, time - timestamp to determine subinterval for market request, next - callback func() to process requesting data).<br>
MongoDB database used in this project. 'crypto' database and two collections 'D1' and 'H1' where stored days and hours data. There're some fields: _id - database unique Object, pair - currency pair, time - timestamp of data, open/close/high/low - OCHL like market model data, price fields and market - name of source data market.<br>
In app.js started two child processes(refDB and ref30 './services/refreshDB.js' and './services/refresh30Day.js') via fork (node module 'child_process'). refDB used RatesProvider via marketToDB() to database history data inputs and there're setting up time interval to make it sometimes. The same time schem apply with ref30 process to refresh data into global object variable global.data where setting up currency pairs arrays. Application use global.data object to send request data as JSON array<br>
