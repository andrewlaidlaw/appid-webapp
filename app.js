const express = require('express'); 								// https://www.npmjs.com/package/express
const session = require('express-session');							// https://www.npmjs.com/package/express-session
const passport = require('passport');								// https://www.npmjs.com/package/passport
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;	// https://www.npmjs.com/package/ibmcloud-appid

const app = express();

app.use(session({
    secret: '123456',
    resave: true,
    saveUninitialized: true
 }));

 app.use(passport.initialize());
 app.use(passport.session());
 passport.serializeUser((user, cb) => cb(null, user));
 passport.deserializeUser((user, cb) => cb(null, user));

passport.use(new WebAppStrategy({
    "clientId": "d94a414b-1d2f-4109-8bef-eaef3b8064d1",
    "tenantId": "57371683-abe3-4f43-bd78-656158df5c61",
    "secret": "OGRlMTJlODctYjA2YS00ZDY4LTg3NTQtYTU1Nzk0ZjMyNGJj",
    "oAuthServerUrl": "https://eu-gb.appid.cloud.ibm.com/oauth/v4/57371683-abe3-4f43-bd78-656158df5c61",
    "redirectUri": "http://localhost:3002/appid/callback"
}));

app.get('/appid/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME));

app.get('/appid/login', passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
    successRedirect: '/',
    forceLogin: true
}));

app.get('/appid/logout', function(req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});

app.use('/api', (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
})

app.get('/api/user', (req, res) => {
    console.log(req.session);
    console.log(req.session.passport.user.identities);
    res.json({
        user: {
            name: req.user.name
        }
    });
 });

// app.use(passport.authenticate(WebAppStrategy.STRATEGY_NAME));

app.use(express.static('./public'));

app.listen(3002, () => {
    console.log('Listening on http://localhost:3002')
});