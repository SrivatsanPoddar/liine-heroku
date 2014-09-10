var PG = require('./knex');

exports.getCalls = function(req, res) {
	console.log("Get calls for device ID called");
	var device_id = req.query.device_id;

	PG.knex('calls').orderBy('start_time','desc').select().where('device_id',device_id).innerJoin('companies','calls.company_id','companies.company_id').then(function(result) {
		console.log('{"Calls": ' + JSON.stringify(result) + '}');	     
		res.send(JSON.parse('{"Calls": ' + JSON.stringify(result) + '}'));
	}).catch(function(error) {
		console.error("Error retrieving lists of past calls: " + error);
	});
};

exports.addCall = function (req, res) {
	console.log("Add call to call log called with req body: ");
	console.log(req.body);

	var device_id = req.body.device_id;
	var start_time = req.body.start_time;
	var end_time = req.body.end_time;
	var company_id = req.body.company_id;
	var response_ids = req.body.response_ids;
	var call_path_node = req.body.call_path;
	var call_path_string = req.body.call_path_string;

	var call_path_id = [];
	var stored_information = req.body.stored_information;

	//Convert call_path of type node[] to call_path of type int[] for D


	for(var i = 0; i < call_path_node.length;i++) {
	    call_path_id.push(call_path_node[i].node_id);
	}

	PG.knex('calls').insert(
		{device_id: device_id, start_time: start_time, 
			end_time: end_time, company_id: company_id, response_ids: response_ids,
			call_path_id: call_path_id, stored_information: stored_information, call_path_string: call_path_string}).returning('call_id')
	.then(function(result) {
		  console.log("Call added with call_id: " + result);
	      res.send(201, {call_id: result[0]});
	}).catch(function(error) {
		console.error("Error inserting new call to call log: " + error);
	});

};