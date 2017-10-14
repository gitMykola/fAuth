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
     
              
###   Api:
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
   ###### POST /oauth2 


###	description:
    All tests were provided via Postman
    Serialization of test actions is next:
     POST to /genesis
        request body:
                {
                    phone: string of phone number like +380945554455
                }
        response:
            {
                "error": null,
                "data": random string like "kpOF"
            }        
     POST to /message
        request body:
                {
                    message: string from '/genesis' response like "kpOF"
                }       
                
        response:
                {
                    "error": null,
                    "data": {
                        "error": null,
                        "data": string with created user Id "59ddeac7653b412412be1da2"
                    }
                } 
     POST to /account
            request body:
                {
                    passphrase:string with user secret (length 8 symbols),
                    userId:string from '/message' response
                }                      
            response:
                {
                    "error": null,
                    "data": string Ethereum transaction address "0xb5486e0ca53C9D0130d1855eCA1F388BB937f2F2"
                }  
     POST to /config
            request body:
                {
                    userId:string of user Id like '59ddeac7653b412412be1da2'
                    config:json {
                                "googleAuth": boolean flag of Google transaction confirmation like 'false' or 'true'
                                }
                }
            response:
                {
                    "error": null,
                    "data": "Config has setted."
                }       
     POST to /transaction/create
            request body:
                {
                    phone:string of reciever phone number '+380949506688'
                    passphrase:string sender secret like '59ddeac7'
                    userId:string of user-sender Id like '59ddeac7653b412412be1da2'
                    ammount:number in wei like '34565'
                } 
            response:
                {
                    "error": null,
                    "data": {
                        "phone": string of phone reviever user number "+380949506699",
                        "passphrase": string - passphrase of user - sender "59ddeac7",
                        "userId": "59ddeac7653b412412be1da2",
                        "ammount": "34565",
                        "_id": string of temporary transaction Id like "59ddf8af120c2c2c10abcb2d"
                    }
                }          
      POST to /transaction/send    !!!BEFORE THIS ACTION INSSUE USER ACCOUNT VIA http://faucet.ropsten.be:3001/
                 request body:
                                 {
                                     phone:string of reciever phone number '+380949506688'
                                     passphrase:string sender secret like '59ddeac7'
                                     userId:string of user-sender Id like '59ddeac7653b412412be1da2'
                                     ammount:number in wei like '34565'
                                 }
                 response:
                        {
                            "error": null,
                            "data": string with info about succesfull transaction 
                        }                  
                              
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
    
    