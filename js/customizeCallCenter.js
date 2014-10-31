var PG = require('./knex');

exports.getCustomImages = function(req, res) {
 	var company_id = req.query.company_id;
 		
	PG.knex('companies').select('image_urls').where('company_id',company_id).then(function(result) {
		var image_urls = result[0].image_urls;
		console.log("Retrieved custom images with result", image_urls);
		res.send(201,{image_urls: image_urls});
	}).catch(function(err) {
		console.error("Error retrieving custom images", err.toString);
		res.send(501,err);
	});
};


exports.setCustomImages = function(req, res) {
	var company_id = req.body.company_id;
	var image_urls = req.body.competitors;
	PG.knex('companies').update('image_urls',image_urls).where('company_id',company_id).then(function(result) {
		console.log("Updated images");
		res.send(201,{result:result[0]});
	}).catch(function(error) {
		console.error("Error updating images for company with company_id: " + company_id + ". The reported error: " + error);
		res.send(500,"Error updating images");
	});
};

