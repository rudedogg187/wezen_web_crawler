// Import express modules for route handling 
var express = require('express');
const app = express(); 
var d3 = require('d3');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');
var path = require('path');

// Port to run application on server 
app.set('port', 8557);
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

// Logger for development 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false }));
app.use(cookieParser());

// Enable crawler routes to be written in their own file 
require('./routes/crawler')(app);
require('./routes/indexRoutes')(app);
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



