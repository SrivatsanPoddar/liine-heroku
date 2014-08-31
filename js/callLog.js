var PG = require('./knex');

exports.addCall = function (res, req) {
	console.log("Add call to call log called");

	var device_id = req.body.device_id;
	var start_time = req.body.start_time;
	var end_time = req.body.end_time;
	var company_id = req.body.company_id;
	var response_ids = req.body.response_ids;
	var call_path = req.body.call_path;

	PG.knex('calls').insert(
		{device_id: device_id, start_time: start_time, 
			end_time: end_time, company_id: company_id, response_ids: response_ids,
			call_path: call_path}).returning('call_id')
	.then(function(result) {
		  console.log("Call added with call_id: " + result);
	      res.send(201, {call_id: result[0]});
	}).catch(function(error) {
		console.error("Error inserting new call to call log: " + error);
	});

};