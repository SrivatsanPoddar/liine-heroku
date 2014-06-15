var express = require("express")
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');
var conString = "postgres://ivaqkulwuyokvo:JBfCRSFIcaWoqRI_jE0dL36DnV@ec2-107-21-100-118.compute-1.amazonaws.com:5432/dbjkvhetm21oap";

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
});

app.get('/testquery', function(req, res)
{
    pg.connect(conString, function(err, client, done)
    {
        if(err)
        {
          return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM instructiontree WHERE parent_node_id IS NULL', function(err, result)
        {
            //call `done()` to release the client back to the pool
            done();
            if(err)
            {
              return console.error('error running query', err);
            }
            res.send(result);
            res.send('End of results');
        });
    });
});

var port = Number(process.env.PORT || 5000);

app.listen(port, function()
{
  console.log("Listening on " + port);
});