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
/api/v1.0/{:pair}
    Close price for last 30 days
    Example: GET request with endpoint http://profee.club/api/v1.0/BTC-USD
    response:
      error = Strimg || null,
      data  = Array(
            date = YYYY-MM-DD,
            priceClose = Decimal,
        ) || null.
