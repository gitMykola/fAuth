# Crypto currencies api 2.0
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
        Debian (release 9.1)
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
    and check all error message, if there're it's will be.
    
    The last step - geth installation and starting(including synchronization). It's take a time
    depend on your hardware and net speed. https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Ubuntu
    To start synchronization print in term. 'geth --testnet --syncmode "fast" --rpc --rpcapi db,eth,net,web3,personal --cache=1024 --rpcport 8545 --rpcaddr 127.0.0.1 --rpccorsdomain "*" --bootnodes "enode://20c9ad97c081d63397d7b685a412227a40e23c8bdc6688c6f37e97cfbc22d2b4d1db1510d8f61e6a8866ad7f0e17c02b14182d37ea7c3c8b9c2683aeb6b733a1@52.169.14.227:30303,enode://6ce05930c72abc632c58e2e4324f7c7ea478cec0ed4fa2528982cf34483094e9cbc9216e7aa349691242576d552a2a56aaeae426c5303ded677ce455ba1acd9d@13.84.180.240:30303"'
    (without '' of course and wait while it'll be done).
    
    Don't forget setup /services/config.js (there're you should check mongo settings, it's apply 
    to mongo connection string and host + port.
     
              
###   API:
#####   Test url http://194.71.227.15/api/v2.0
   ###### POST /genesis
   ###### POST /message          
   ###### POST /account   
   ###### POST /config
   ###### POST /transaction/:action 
   create - send transaction data
   send - send passphrase if googleAuth == false
   confirm - send passpfrase and google auth data                                

#####   Test url http://194.71.227.15/api/v3.0
   ###### GET /
   ###### POST /phonevalid          
   ###### POST /smsconfirm  
   ###### POST /password
   ###### POST /auth
   ###### POST /googletoken
   ###### POST /send/:cur
   ###### GET  /balance
   ###### POST /contacts 


###	description:
    All tests were provided via Postman
    Serialization of test actions is next:
     GET to /
        no request body
        response:{
                    "c1":"http://194.71.227.15/api/v3.0/phonevalid",
                    "c2":"http://194.71.227.15/api/v3.0/smsconfirm",
                    "c3":"http://194.71.227.15/api/v3.0/password",
                    "c4":"http://194.71.227.15/api/v3.0/auth",
                    "c5":"http://194.71.227.15/api/v3.0/googletoken",
                    "c6":"http://194.71.227.15/api/v3.0/send",
                    "c7":"http://194.71.227.15/api/v3.0/contacts"
                    },
     POST to /phonevalid
        request body:
                {
                    pn: +380931311333 (PhoneNumber),
                    on: 0/1 (0 - Android, 1 - iOS),
                    h1: 144.11.3.12 (IP-address),
                    p3: 8679300256755 IMEI-code,
                    ul: ru en (etc Language),
                }
        response:
            {
                "r":{ 
                        null (validation ok),
                        0 (wrong some field or body request),
                        1 (phone number exist),
                        2 (device in spam),
                     }   
                "r1":{
                    "k1":"34527" (fake of SMC to confirm user),
                    "u1":"b870da30902ff5c9a433c19aab2cfc32" (value for next query),
                }
            }        
     POST to /smsconfirm?ss=b870da30902ff5c9a433c19aab2cfc32 (value of ss is a u1 from previous request)
        request body:
                {
                    "ph":"+380931311333" (user phone number),
                    "ss":"24760" (SMS confirm),
                    "s":"59e22584159fe127acf1a8e730902ff5" (md5 of u1 parameter from previous request),
                }       
                
        response:
                {
                    "rp": 
                        null,
                        0 (wrong some field or body request),
                        1 (phone number exist),
                        2 (device in spam),
                        3 (SMS confirmation),  
                        4 (hash wrong),
                        5 (hash time less),
                } 
     POST to /password
            request body:
                            {
                                "p001":"Ikdfjlll" (user password),
                                "sp":"59e22584159fe127acf1a8e730902ff5" (md5 of u1 parameter from previous request),
                            }       
                            
                    response:
                            {
                                "rp": 
                                    null,
                                    0 (wrong some field or body request),
                                    1 (phone number exist),
                                    2 (device in spam),
                                    3 (hash wrong),  
                                    4 (hash time less),
                            }   
     POST to /auth
            header: Authorization: Basic dt,
                dt - base64(login:password), where login - phone user number, password - user password,
            
            response:
            header: WWW-Authenticate: Basic token=tk, where token - JSON WEB TOKEN responder by token
            body:
                {
                    "rp":{
                        null,
                        0 (wrong header),
                        1 (no user),
                        2 (password wrong),
                    }
                }       
     POST to /googletoken
            request body:
                {
                    "rg":gtoken (Google token via google authorization),
                } 
            response:
                {
                    "rg":
                        null (token ok!),
                        0 (token wrong or request failure),
                    }
                }          
      POST to /send/:cur    !!!BEFORE THIS ACTION INSSUE USER ACCOUNT VIA http://faucet.ropsten.be:3001/
                 request body:
                                 {
                                     "to":"+380931311333" (user phone),
                                     "am":"0x6E67F80aAA081Ac4Ed956d74547D1C77C7CaD2c7" (ethereum account address),
                                     "p001":"Ikdfjlll" (user password),
                                 }
                 auth response:
                        {
                            "rt": 
                            0 (token wrong),
                            1 (token time less), 
                        }
                 route response:
                        {
                            "rx":
                                hash (hash transfered tansaction),
                                0 (transaction failure),
                        }             
      GET to /balance
      POST to /contacts                              
                              
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
         
         'ethAccounts' => {
                            '_id'    = ObjectId("{:userId}") unique field of account address id,
                            'user'   = Id user id string, !!! not ObjectId
                            'address'= String Ethereum account address
                            }, 
         'tpmTX'       => {
                            '_id'    = ObjectId("{:userId}") unique field of temporary transaction id,
                            'phone'  = String with user-reciever phone number
                            'passphrase'= String with user-sender secret. It's mean to ask about this one, 
                                            when user going to send to somebody any ammount. 
                            'userId'    = String with user-sender Id
                            'ammount'   = Number sending value in wei(ethereum cents) 
                            },
         'tmpUsers'    => {
                            '_id'    = ObjectId("{:userId}") unique field of user-without-message-confirmation id,
                            'phone'  = String with user-reciever phone number
                            'message'= String random message for user confirmation
                            'created_at'=Number milliseconds like Unix timestamp, when user created
                            }                             
     
     
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
    
    