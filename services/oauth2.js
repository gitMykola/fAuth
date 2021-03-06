let config              = require('../services/config'),
    oauth2orize         = require('oauth2orize'),
    passport            = require('passport'),
    crypto              = require('crypto'),
    User                = require('../models/User'),
    Client              = require('../models/Client'),
    AccessToken         = require('../models/AccessToken'),
    RefreshToken        = require('../models/RefreshToken');

// create OAuth 2.0 server
let server = oauth2orize.createServer();

// Exchange username & password for access token.
server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, next) {
    User.getUserByName(username, function(err, user) {
        if (err) { return next(err); }
        if (!user) { return next(null, false); }
        if (!User.verifyPassword(password,user)) { console.log('Not verify! '+password+' '+user.name);return next(null, false); }

        let to = { userId: user._id.toString(), clientId: client._id.toString() };

        RefreshToken.removeToken(to, function (err) {
            if (err) return next(err);
        });
        AccessToken.removeToken(to, function (err) {
            if (err) return next(err);
        });

        let tokenValue = crypto.randomBytes(32).toString('base64');
        let refreshTokenValue = crypto.randomBytes(32).toString('base64');
        let token = { token: tokenValue, clientId: client._id.toString(), userId: user._id.toString() };
        let refreshToken = { token: refreshTokenValue, clientId: client._id.toString(), userId: user._id.toString() };
        RefreshToken.setToken(refreshToken,function (rtk) {
            if (rtk.error) { return next(rtk.error); }
        });
        let info = { scope: '*' };
        AccessToken.setToken(token,function (atk) {
            if (atk.error) return next(atk.error);
             //next(null, tokenValue, refreshTokenValue, { 'expires_in': config.app.tokenLive });
        });
        next(null, tokenValue, refreshTokenValue, { 'expires_in': config.app.tokenLive });
    });
}));

// Exchange refreshToken for access token.
server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, next) {
    RefreshToken.getTokenByToken(refreshToken, function(rtkn) {
        if (rtkn.error) { return next(rtkn.error); }
        if (!rtkn.token) { return next(null, false); }
        if (!rtkn.token) { return next(null, false); }

        User.getUserById(rtkn.token.userId, function(err, user) {
            if (err) { return next(err); }
            if (!user) { return next(null, false); }

            let to = { userId: user._id.toString(), clientId: client._id.toString() };

            RefreshToken.removeToken(to, function (err) {
                if (err) return next(err);
            });
            AccessToken.removeToken(to, function (err) {
                if (err) return next(err);
            });

            let tokenValue = crypto.randomBytes(32).toString('base64');
            let refreshTokenValue = crypto.randomBytes(32).toString('base64');
            let token = { token: tokenValue, clientId: client._id.toString(), userId: user._id.toString() };
            let refreshToken = { token: refreshTokenValue, clientId: client._id.toString(), userId: user.userId.toString() };
            RefreshToken.setToken(refreshToken,function (rtkn) {
                if (rtkn.error) { return next(rtkn.error); }
            });
            let info = { scope: '*' };
            AccessToken.setToken(token,function (atkn) {
                if (atkn.error) { return next(atkn.error); }
                next(null, tokenValue, refreshTokenValue, { 'expires_in': config.app.tokenLive });
            });
        });
    });
}));


// token endpoint
exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    server.token(),
    server.errorHandler()
];