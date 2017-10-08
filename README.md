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
    monk ^6.0.4,
    morgan ~1.8.1,
    node-compass ^0.2.3,
    serve-favicon ~2.4.2,
    xmlhttprequest ^1.8.0
    web3 0.19.0
    web3-eth-personal ^1.0.0-beta.22
    googleapis ^22.2.0
    
#
#### SETUP AND INSTALLATION
   ###### ENVIRONMENT
    It was tested on Ubuntu 16.04(x64) and CentOS (centos-release-7-3.1611.el7.centos.x86_64)
    Disk space should be more 15Gb to use ethereum testnet
    
    All next steps will be executed into terminal connected to 
    your server via ssh (Example command line mykola@mykola-UX360CA:~$ ssh root@profee.club).
    
    For the first Create work directory (Example /var/www/ProjectName) and
    install node.js (https://nodejs.org/uk/download/package-manager/#debian-and-ubuntu-based-linux-distributions,
    https://www.digitalocean.com/community/tutorials/node-js-ubuntu-16-04-ru),
    also you should to install all modules from dependencies (look in /package.json - dependencies block)
    
    For the second install MongoDB 
       En https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-mongodb-on-ubuntu-16-04
       Ru https://www.digitalocean.com/community/tutorials/mongodb-ubuntu-16-04-ru
    (there're you should find way to setup mongo like daemon process
    to check this ok status print in command line '/path to mongo installation/mongo'
    or just 'mongo' if you create link for this one, and you should see mongo command line,
    and you can check all you system proccesses to print in comman terminal line(not in mongo
     command line, don't forget exit via Ctrl+C) 'ps -A' and you'll see all proccess list.
      
    The third step will check correct application start. Print into command line 'npm start' 
    and check all error message, if there're it's will be. In the all right way you will see 
    application console message with database refreshing proccess. This proccess will start 
    every 24 hour since you start application. There're you can find 3 node proccess into 
    application(look it's via 'ps -A' in command term. line). 1-app.js(main application), 
    2-refreshDB.js(database refresh child proccess, its read markets via ajax requests into 
    /markets/gdax.js and others will be) 3-refresh30Day.js(child proccess to refresh global 
    array where statistic data response to users via api requests)
    In the way you fix all error with application starting via command line, you can make 
    daemon proccess to autostart application. It's like mongod daemon, just create text file 
    into '/etc/systemd' directory and run 'systemctl start {your_app_daemon_file_name}'
    check this step via 'ps -A' and look in proccess list 3 node proccess. All console message
    you'll find in '/var/log/message' (if you use CentOS).
    
    The last step - geth installation and starting(including synchronization). It's take a time
    depend on your hardware and net speed. https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Ubuntu
    To start synchronization print in term. 'geth --testnet --syncmode "fast" --rpc --rpcapi db,eth,net,web3,personal --cache=1024 --rpcport 8545 --rpcaddr 127.0.0.1 --rpccorsdomain "*" --bootnodes "enode://20c9ad97c081d63397d7b685a412227a40e23c8bdc6688c6f37e97cfbc22d2b4d1db1510d8f61e6a8866ad7f0e17c02b14182d37ea7c3c8b9c2683aeb6b733a1@52.169.14.227:30303,enode://6ce05930c72abc632c58e2e4324f7c7ea478cec0ed4fa2528982cf34483094e9cbc9216e7aa349691242576d552a2a56aaeae426c5303ded677ce455ba1acd9d@13.84.180.240:30303"'
    (without '' of course and wait while it'll be done).
    
    Don't forget setup /services/config.js (there're you should check mongo settings, it's apply 
    to mongo connection string, also check app.host). /public/javascripts/login.js It's for
    testing some functions via web page. There're check app config array(app.server). 
              
    
#####   
    
    Test url http://profee.club/api/v1.0
###   Api:
   ###### GET /stat/{:pair}
                Close price for last 30 days
    Example: GET request to http://profee.club/api/v1.0/BTC-USD
                response:
                  error = String || null,
                  data  = json array(...{
                        time = timestamp,
                        priceClose = decimal,
                        hour = if close price differency more then 3% beetwin current and previos days
                            JSON Array(...{date = YYYY-MM-DD,
                            priceClose = Decimal}...)
                        else null
                        }...) || null.
   ###### GET /accounts/{:userId}
          Users accounts defined by :userId
    Example: GET request to http://profee.club/api/v1.0/accounts/59d68843117b346c16448446
                response:
                    error = String || null,
                    data = json array(...{
                            currency = String, currency symbol like ETH, BTC & etc.
                            address = String account address
                            })           
   ###### GET /accounts/{:currency_symbol}/txcount/{:address}
         Count account transactions defined by address & currency symbol
    Example: GET request to http://profee.club/api/v1.0/accounts/ETH/txcount/0x56cb9adff6b442697b2eb912a73a618a5b3bea8a
                response:
                    json object {
                        count = nymber of account tranzactions
                        }                                     
###   Currencies pairs:
    BTC-USD
    ETH-USD
###	description:
    There're crypto currencies rates provider class 
    RatesProvider(/providers/RatesProvider.js) where You can find marketsToDB(). 
    This func() without any arguments and main action of this one is a reading
     via ajax requests some brokers(like GDAX and others) api to input crypto
      currency rates history. For example GDAX market has module export func() 
    (/services/gdax.js) who's named like market_1(...) and has 4 params(pair - currency
     pair like 'ETH-USD', period - now Day like D1 or Hour like H1, useing it 
     to set time interval for market request and database collection to save 
     history data, time - timestamp to determine subinterval for market request,
      next - callback func() to process requesting data).<br>
    MongoDB database used in this project.
  ###### database 'crypto'
  ###### collections:
         'users'   => {
                        '_id' = ObjectId("{:userId}") unique field of user id,
                        'name' = String user Name,
                        'email' = String email format, user email,
                        'pwd' = {
                                    'salt' = String user salt, generated by randomstring node modul, length 32
                                    'pass' = String user password, etired via register form & encrypted by crypto node modul, salt was used
                                 },
                        },
         'sessions' => {
                        express-session Object,  https://www.npmjs.com/package/express-session
                        },
         'D1'       => {
                         '_id'    = ObjectId("{:userId}") unique field of days OCHL handle id,
                         'pair'   = String currencies pair like ETH-USD, BTC-USD & etc.
                         'time'   = timestamp Unix timestamp
                         'open'   = decimal open day price
                         'close'  = decimal close day price
                         'high'   = decimal high day price
                         'low'    = decimal low day price
                         'market' = String market name whose data requested & inserted 
                        },
         'H1'       => {
                        '_id'    = ObjectId("{:userId}") unique field of hours OCHL handle id,
                        'pair'   = String currencies pair like ETH-USD, BTC-USD & etc.
                        'time'   = timestamp Unix timestamp
                        'open'   = decimal open hour price
                        'close'  = decimal close hour price
                        'high'   = decimal high hour price
                        'low'    = decimal low hour price
                        'market' = String market name whose data requested & inserted 
                        },
         'ethAccounts' => {
                            '_id'    = ObjectId("{:userId}") unique field of account address id,
                            'user'   = Id user id string, !!! not ObjectId
                            'address'= String Ethereum account address
                            }          
     
     'crypto' database and two collections 'D1' and 'H1' where stored days
      and hours data. There're some fields: _id - database unique Object,
       pair - currency pair, time - timestamp of data, open/close/high/low - OCHL
        like market model data, price fields and market - name of source data market.
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
    
######    current reseaching
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
    https://developers.google.com/identity/protocols/OAuth2
    https://developers.google.com/identity/protocols/OAuth2ForDevices
    https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet
    
    