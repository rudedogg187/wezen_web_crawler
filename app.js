// Import express modules for route handling 
var express = require('express');
const app = express(); 
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

// Enable crawler routes to be written in their own file 
require('./routes/crawler')(app, request, cheerio, URL, bodyParser, syncReq);
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



