// Import express modules for route handling 
var express = require('express');
const app = express(); 
var d3 = require('d3');

// Port to run application on server 
app.set('port', 8557);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Enable crawler routes to be written in their own file 
require('./routes/crawler')(app);
require('./routes/indexRoutes')(app);


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



