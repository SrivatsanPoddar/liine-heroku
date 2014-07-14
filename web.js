var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');
var conString = "postgres://ivaqkulwuyokvo:JBfCRSFIcaWoqRI_jE0dL36DnV@ec2-107-21-100-118.compute-1.amazonaws.com:5432/dbjkvhetm21oap?ssl=true";
var bodyParser = require('body-parser');

app.use(logfmt.requestLogger());
app.use(bodyParser.json());

app.get('/', function(req, res)
{
    res.send('Welcome to safe-hollows');
});

app.get('/nodes', function(req, res)
{
  pg.connect(conString, function(err, client, done)
    {
        if(err)
        {
          return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM instructiontree ORDER BY node_id;', function(err, result)
        {
            //call `done()` to release the client back to the pool
            done();
            if(err)
            {
              return console.error('error running query', err);
            }
            res.send(result.rows);
        });
    });
});

app.get('/:company_id/questions', function(req, res)
{
  pg.connect(conString, function(err, client, done)
    {
        if(err)
        {
          return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM questions WHERE company_id=' + req.params.company_id, function(err, result)
        {
          if(err)
          {
            return console.error('error running query', err);
          }
          //call `done()` to release the client back to the pool
          console.log("Questions retrieved for company " + req.params.company_id + " with results:");
          console.log(result.rows);
          done();

          res.send(result.rows);
        });
    });
});

app.post('/responses', function(req, res)
{
  console.log("Attempt to post new response with body:");
  console.log(req);
  pg.connect(conString, function(err, client, done)
    {
        if(err)
        {
          return console.error('error fetching client from pool', err);
        }
        var queryString = "INSERT INTO responses (question_id, response) VALUES (" + req.body.question_id + ",'" + req.body.response + "') RETURNING response_id;";
        console.log('Query String: ' + queryString);
        client.query(queryString, function(err, result)
        {
          if(err)
          {
            return console.error('error running query', err);
          }
          //call `done()` to release the client back to the pool
          console.log("Response inserted with response_id:");
          console.log(result);
          done();

          res.send(201);
        });
    });
});

app.get('/users', function(req, res)
{
  res.send('Dummy User :(');
});

var port = Number(process.env.PORT || 5000);

app.listen(port, function()
{
  console.log("Listening on " + port);
});