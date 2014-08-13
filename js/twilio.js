

var accountSid = 'ACfe7ddd180dd6aa154eb427681809b89a';
var authToken = 'dc41ceb8a176552c330fd94de0eb6038';
var twilio = require('twilio');
var client = twilio(accountSid, authToken);

exports.getCallToken = function(req, res) {
	var capability = new twilio.Capability(accountSid, authToken);
	capability.allowClientOutgoing('APe8704b7e91973ef8803f06f670c76b0b');
	res.send(201,{token: capability.generate()});
};
//Sends text message to myself
//client.messages.create({body: "Sup Piyush!", to: "+16098510053", from: "+16093371084"});

//exports.client = client;