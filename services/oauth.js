let config                  = require('../services/config'),
    passport                = require('passport'),
    BasicStrategy           = require('passport-http').BasicStrategy,
    ClientPasswordStrategy  = require('passport-oauth2-client-password').Strategy,
    BearerStrategy          = require('passport-http-bearer').Strategy,
    User                    = require('../models/User'),
    Client                  = require('../models/Client'),
    AccessToken             = require('../models/AccessToken'),
    RefreshToken            = require('../models/RefreshToken');

passport.use(new BasicStrategy(
    function(username, password, next) {
        Client.getClientByName(username, function(clt) {
            if (clt.error) { return next(clt.error); }
            if (!clt.client) { return next(null, false); }
            if (clt.client.secret !== password) { return next(null, false); }

            return next(null, clt.client);
        });
    }
));

passport.use(new ClientPasswordStrategy(
    function(clientId, clientSecret, next) {
        Client.getClientById(clientId, function(clt) {
            if (clt.error) { return next(clt.error); }
            if (!clt.client) { return next(null, false); }
            if (clt.client.secret !== clientSecret) { return next(null, false); }

            return next(null, clt.client);
        });
    }
));

passport.use(new BearerStrategy(
    function(accessToken, next) {
        AccessToken.getTokenByToken(accessToken, function(tkn) {
            if (tkn.error) { return next(tkn.error); }
            if (!tkn.token) { return next(null, false); }

            if( Math.round((Date.now()-tkn.token.created_at)/1000) > config.app.tokenLive ) {
                AccessToken.removeToken({token:accessToken}, function (err) {
                    if (err) return next(err);
                });
                return next(null, false, { message: 'Token expired' });
            }

            User.getUserById(token.userId, function(err, user) {
                if (err) { return next(err); }
                if (!user) { return next(null, false, { message: 'Unknown user' }); }

                let info = { scope: '*' };
                next(null, user, info);
            });
        });
    }
));