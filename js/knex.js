var knex = require('knex')({
  client: 'pg',
  connection: {
		host : 'ec2-107-21-100-118.compute-1.amazonaws.com',
		user: 'ivaqkulwuyokvo',
		password: 'JBfCRSFIcaWoqRI_jE0dL36DnV',
		database: 'dbjkvhetm21oap',
		ssl: 'true'
	}
  });

exports.knex = knex;