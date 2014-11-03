var PG = require('./knex');

exports.getInstructionTree = function(req, res) {
	var company_id = req.query.company_id;

	PG.knex('companies').select('instruction_tree').where('company_id',company_id).then(function(result) {
		console.log("Result of retrieving instruction tree:");
		console.log(result);	     
		res.send(201,JSON.parse('{"instruction_tree": ' + JSON.stringify(result[0]) + '}'));

	}).catch(function(error) {
		console.error("Error retrieving instruction tree for company with company_id: " + company_id + ". The reported error: " + error);
	});

};

exports.saveInstructionTree = function(req, res) {

	var instruction_tree = req.body.instruction_tree;
	var company_id = req.body.company_id;
	console.log("instruction tree:");
	console.log(instruction_tree);
	PG.knex('companies').update('instruction_tree',instruction_tree).where('company_id',company_id).then(function(result) {
		  console.log("Updated instruction tree: " + result);
	      res.send(201, {result: result[0]});
	}).catch(function(error) {
		console.error("Error updating instruction tree for company with company_id: " + company_id + ". The reported error: " + error);
	});
};

exports.addJSONtree = function(req, res) {

	var instruction_tree = req.body;
	console.log("Instruction Tree:");
	console.log(instruction_tree);
	var instruction_tree_array = [instruction_tree];
	var company_id = instruction_tree.company_id;
	PG.knex('companies').update('instruction_tree', instruction_tree_array).where('company_id', company_id).then(function(result) {
		console.log("Successfully added JSON Tree");
		res.send(201,{response:result});
	}).catch(function(err) {
		console.error("Error adding JSON tree", err);
		res.send(500,"Error adding JSON tree: " + err);
	});
}