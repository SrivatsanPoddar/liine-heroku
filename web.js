var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');
var conString = "postgres://ivaqkulwuyokvo:JBfCRSFIcaWoqRI_jE0dL36DnV@ec2-107-21-100-118.compute-1.amazonaws.com:5432/dbjkvhetm21oap?ssl=true";
var bodyParser = require('body-parser');
var cors = require('cors');
var WebSocketServer = require('ws').Server;
var http = require('http');
var twilio = require('./js/twilio');

app.use(logfmt.requestLogger());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/app'));
app.use(cors());

var port = Number(process.env.PORT || 5000);
var server = http.createServer(app);
server.listen(port);
console.log("http server listening on %d", port);

//Create websocket server
var wss = new WebSocketServer({server: server, path:"/live"});
console.log("websocket server created");
var activeConnections = {};
var index = 0;

//Accept web-socket connections
wss.on("connection", function(ws) {
  activeConnections[index + ""]  = ws;
  ws["myIndex"] = index + "";
  console.log("websocket connection open with index: " + index);
  index++;
  console.log("# of Active Connections:" + Object.keys(activeConnections).length);
  // var id = setInterval(function() {
  //   ws.send(JSON.stringify(new Date()), function() {  });
  // }, 1000);

  
  ws.on("message", function(rawData, flags) {
    console.log("Received message: " + JSON.stringify(rawData));
    var receivedData = JSON.parse(rawData);
    console.log(receivedData);

    //Check to see if the message is from a company settings it's own ID
    if (receivedData.hasOwnProperty("set_company_id")) {
      ws.company_id = receivedData.set_company_id;
    }

    //Check to see if message is from a client and set it's target company
    if (receivedData.hasOwnProperty("set_target_company_id")) {
      ws.target_company_id = receivedData.set_target_company_id;
    }

    //If this socket is an identified company, send the message to all clients that specify this company as its target
    if(ws.hasOwnProperty("company_id")) {
      for (var ind in activeConnections) {
          if (activeConnections[ind].target_company_id === ws.company_id) {
            activeConnections[ind].send(rawData);
          }
      }
      ws.send(rawData);  //Also send the message to itself
      console.log("Sending data: " + JSON.stringify(rawData));
    }

    //If this socket has set a target company, send the message to the connections of this company
    if(ws.hasOwnProperty("target_company_id")) {
      for (var i in activeConnections) {
          if (activeConnections[i].company_id === ws.target_company_id) {
            activeConnections[i].send(rawData);
          }
      }
      ws.send(rawData);
      console.log("Sending data: " + JSON.stringify(rawData));
    }

   //ws.send(data);
    //console.log("Sending data: " + JSON.stringify(data));
  });

  ws.on("close", function() {
    console.log("websocket connection close");
    delete activeConnections[ws["myIndex"]];
    //clearInterval(id);
  });

});

// //Handle web-sockets
// wss.on("connection", function(ws) {
//   var id = setInterval(function() {
//     ws.send(JSON.stringify(new Date()), function() {  });
//   }, 1000);

//   console.log("websocket connection open");

//   ws.on("close", function() {
//     console.log("websocket connection close");
//     clearInterval(id);
//   });
// });

app.get('/', function(req, res) {
    res.sendfile('./build/index.html');
    // console.log("GEtting!");
    // res.sendfile('./app/index.html');  //Test web-socket
});

app.get('/test', function(req, res) {
    //res.sendfile('./build/index.html');
    console.log("GEtting!");
    res.sendfile('./app/index.html');  //Test web-socket
});

app.get('/nodes', function(req, res) {
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

app.get('/:company_id/questions', function(req, res) {
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

app.post('/responses', function(req, res) {
  console.log("Attempt to post new response with body:");
  console.log(req);
  pg.connect(conString, function(err, client, done)
    {
        if(err)
        {
          return console.error('error fetching client from pool', err);
        }
        var queryString = "INSERT INTO responses (question_id, response, device_id) VALUES (" + req.body.question_id + ",'" + req.body.response + "','" + req.body.device_id + "') RETURNING response_id;";
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

app.get('/users', function(req, res) {
  res.send('Dummy User :(');
});

app.get('/requestCallToken',twilio.getCallToken);

app.get('/requestCallTokenIncoming',twilio.getCallTokenIncoming);

app.post('/twiml',twilio.returnTwiml);