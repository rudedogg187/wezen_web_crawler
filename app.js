// Import express modules for route handling 
var express = require('express');
const app = express(); 
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportSetup = require("./config/passportSetup");
const authRoutes = require("./routes/authRoutes");
const keys = require("./config/keys");

var d3 = require('d3');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var bodyParser = require('body-parser');
var syncReq = require('sync-request');
var fs = require('fs');
// Port to run application on server 
app.set('port', 8557);

var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Logger for development 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false }));
app.use(cookieParser());

// Session cookie encrypter
app.use(cookieSession({
  //expires in one day
  maxAge: 24 * 60 * 60 * 1000,
  //encyrption keys
  keys: [keys.session.cookieKey],
}));

// Init Passport
app.use(passport.initialize());
// Init Passport Sessions for login
app.use(passport.session());

// Auth Routes
app.use("/auth", authRoutes);

// Enable crawler routes to be written in their own file 
require('./routes/crawler')(app, cheerio, URL, bodyParser, syncReq, fs);
require('./routes/indexRoutes')(app);
require('./routes/accounts')(app);
require('./routes/seeds')(app);

app.use((req, res) => {
  res.type('text/plain');
  res.status(404);
  res.send('Oops, that one\'s not found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.type('text/plain');
  res.status(500);
  res.send('Server error - 500');
});

app.listen(app.get('port'), () => {
  console.log('Server Started');
});



