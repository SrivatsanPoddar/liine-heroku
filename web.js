var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());

app.get('/', function(req, res)
{
  res.send('Hello World!');
});


app.get('/users', function(req, res)
{
  res.send('Dummy User :(');
});

app.get('/akshay', function(req, res)
{
    res.send('Akshay can finally use Node.js');
})

var port = Number(process.env.PORT || 5000);

app.listen(port, function()
{
  console.log("Listening on " + port);
});