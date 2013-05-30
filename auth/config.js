var conf;

var setConfig = function(conf) {
	conf = conf;
};

module.exports = {

	// server settings
	server_protocol: 'http://',
	server_domain: 'localhost',
	server_port: 8080,

	// routing settings
	main_route: 'home',

	// database settings
	db_username: 'baniol',
	db_dbname: 'node-auth',
	db_password: 'szapo123',
	db_host: 'localhost',
	db_port: 3306,

	// smtp settings
	smtp_password: 'SZapo_1275',
	smtp_mail: 'marcin.baniowski@gmail.com',
	smtp_service: 'Gmail'
};

module.exports.setConfig = setConfig;
module.exports.getConfig = conf;