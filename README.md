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
      data  = Array(<br>
            date = YYYY-MM-DD,<br>
            priceClose = Decimal,<br>
            hour = if close price differency more then 3% beetwin current and previos days <br>
                Array(date = YYYY-MM-DD,<br>
                priceClose = Decimal)<br>
            else null<br>
        ) || null.<br>
#   Currencies pairs:
BTC-USD<br>
ETH-USD
