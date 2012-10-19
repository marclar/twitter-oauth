var express = require('express');
var http = require('http');
var path = require('path');

var express = require('express');


var config = {
        consumerKey: "CONSUMER KEYS", /* per appications - manage apps here: https://dev.twitter.com/apps */
     consumerSecret: "CONSUMER SECRET", /* per appications - manage apps here: https://dev.twitter.com/apps */
             domain: "http://172.16.0.14:83",
              login: "/twitter/sessions/connect",
             logout: "/twitter/sessions/logout",
      loginCallback: "/twitter/sessions/callback",  /* internal */
   completeCallback: "/search/gosquared"  /* When oauth has finished - where should we take the user too */
};

twitterAuth = require('../app.js')(config);

var app = express.createServer();

app.configure(function(){
  app.set('port', 83);
});

app.use(express.cookieParser());
app.use(express.session({ secret: 'secret key' }));
app.use(express.bodyParser());


app.get('/', function(req, res){
  res.send('<a href="'+config.login+'">login with twitter</a>');
});


app.get('/search/:term', twitterAuth.middleware, function(req, res){
  twitterAuth.search(req.params.term, function(error, data) {
    res.json(data);
  }, req.session.oauthAccessToken, req.session.oauthAccessTokenSecret);
});

app.get(config.login, twitterAuth.oauthConnect);
app.get(config.loginCallback, twitterAuth.oauthCallback);
app.get(config.logout, twitterAuth.logout);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
