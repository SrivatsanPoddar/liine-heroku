var PG = require('./knex');

exports.getSpecifiedCompetitors = function(req, res) {
 	var company_id = req.query.company_id;

 		PG.knex('companies').select('company_id','company_name').then(function(all_companies) {
 			PG.knex('companies').select('competitors').where('company_id',company_id).then(function(specified_competitors) {
 			 		console.log("Result of retrieving specified competitors/list of companies:");
 			 		console.log(specified_competitors);	     
 			 		res.send(201,{all_companies: all_companies, specified_competitors:specified_competitors[0]});
 			 	}).catch(function(error) {
 			 		console.error("Error getting specified_competitors. The reported error: " + error);
 			 		res.send(500,"Error getting competitors");
 			 	});
		});
};


exports.setSpecifiedCompetitors = function(req, res) {
	var this_company_id = req.body.company_id;
	var competitors = req.body.competitors;
	PG.knex('companies').update('competitors',competitors).where('company_id',this_company_id).then(function(result) {
		console.log("Updated competitors");
		res.send(201,{result:result[0]});
	}).catch(function(error) {
		console.error("Error updating competitors for company with company_id: " + company_id + ". The reported error: " + error);
		res.send(500,"Error updating competitors");
	});
};

exports.getCompetitors = function(req, res) {
	var this_company_id = req.query.company_id;

	var subquery = PG.knex.raw('SELECT company_id, company_name FROM companies WHERE ? = ANY(competitors)',this_company_id).then(function(result) {
		console.log("The fetched competitors:");
		console.log(result.rows);
		res.send(201,{competitors:result.rows});
	}).catch(function(error) {
		console.error("Error getting competitors for company with company_id: " + this_company_id + ". The reported error: " + error);
		res.send(500,"Error getting competitors");
	});
};



exports.getCompetitorsAd = function(req, res) {
	var this_company_id = req.query.company_id;

	var subquery = PG.knex.raw('SELECT advertisement_url FROM companies WHERE ? = ANY(competitors)',this_company_id).then(function(result) {
		console.log("The fetched competitors ad URL:");
		if (result.rows.length === 0) {
			res.send(201,{response:"NO_ADS"});
			return;
		}
		var random_competitor_row = Math.floor((Math.random() * result.rows.length));
		console.log(result.rows[random_competitor_row]);
		res.send(201,{response: result.rows[random_competitor_row].advertisement_url});
	}).catch(function(error) {
		console.error("Error getting competitors for company with company_id: " + this_company_id + ". The reported error: " + error);
		res.send(500,"Error getting competitors");
	});
};

exports.getParentNodes = function(req, res) {
	PG.knex('companies').select("company_name","company_id").orderBy('company_name','asc').then(function(result) {
		res.send(201,result);
		console.log("Successfully retrieved parent nodes");
	}).catch(function(err) {
		console.error("Error retrieiving parent nodes", err);
		res.send(501,"Error retrieiving parent nodes: " + err);
	});
}