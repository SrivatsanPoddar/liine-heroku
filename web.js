var express = require("express")
var pg = require('pg').native,
    connectionString = "postgres://ivaqkulwuyokvo:JBfCRSFIcaWoqRI_jE0dL36DnV@ec2-107-21-100-118.compute-1.amazonaws.com:5432/dbjkvhetm21oap",
    start = new Date(),
    port = process.env.PORT || 5000,
    client;
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());

client = new pg.Client(connectionString);
client.connect();

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
});

app.get('/testquery', function(req, res)
{
    query = client.query('SELECT * WHERE PARENT_NODE = NULL FROM instructiontree');
    query.on('row', function(result)
    {
        console.log(result);
        if (!result)
        {
            res.send('No data found');
        }
        else
        {
            res.send('Visits today: ' + result.count);
        }
    });
});

var port = Number(process.env.PORT || 5000);

app.listen(port, function()
{
  console.log("Listening on " + port);
});