var knex = require('knex')({
  client: 'pg',
  connection: {
		host : 'ec2-54-243-48-227.compute-1.amazonaws.com',
		user: 'khctwifcwaratd',
		password: 'D4-FK0pynGsG7S_wuOn4m1Cyrw',
		database: 'd81o6v1corf28q',
		ssl: 'true'
	}
  });

exports.knex = knex;