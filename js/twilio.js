

var accountSid = 'ACfe7ddd180dd6aa154eb427681809b89a';
var authToken = 'dc41ceb8a176552c330fd94de0eb6038';
var twilio = require('twilio');
var client = twilio(accountSid, authToken);

exports.getCallToken = function(req, res) {
	var capability = new twilio.Capability(accountSid, authToken);
	capability.allowClientOutgoing('APe8704b7e91973ef8803f06f670c76b0b');

	res.send(201,{token: capability.generate()});
};

exports.getCallTokenIncoming = function(req, res) {
	var capability = new twilio.Capability(accountSid, authToken);
	capability.allowClientIncoming(req.params.company_id);
	res.send(201,{token: capability.generate()});
};

exports.returnTwiml = function (req, res) {
	console.log("Twiml Requested with Request Parameters: " + JSON.stringify(req.params));
	var company_id = req.params.To;
	//console.log("Found company_id: " + company_id);
	//var company_id = (req.body.To).substring(8,req.body.To.length + 1);
	console.log("Extracted company_id: " + company_id);
	var resp = new twilio.TwimlReponse();
	resp.dial(function (node) {
		node.client(company_id);
	});
	console.log("Outputted Twiml:");
	console.log(resp.toString());
	res.send(resp.toString());
};

//Sends text message to myself
//client.messages.create({body: "Sup Piyush!", to: "+16098510053", from: "+16093371084"});

//exports.client = client;