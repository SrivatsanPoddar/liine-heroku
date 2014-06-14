var express = require("express");
var logfmt = require("logfmt");
var pg = require('pg');
var app = express();
var DATABASE_URL = "postgres://ivaqkulwuyokvo:JBfCRSFIcaWoqRI_jE0dL36DnV@ec2-107-21-100-118.compute-1.amazonaws.com:5432/dbjkvhetm21oap"

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

app.get('/testquery', function(req, res)
{
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  client.query('SELECT * FROM instructiontree', function(err, result) {
    done();
    if(err) return console.error(err);
    console.log(result.rows);
  });
});
})

var port = Number(process.env.PORT || 5000);

app.listen(port, function()
{
  console.log("Listening on " + port);
});