var db = require('sequelize'),
	conf = require('../config'),
	sql = new db(conf.db_dbname, conf.db_username, conf.db_password, {
		host: conf.db_host,
		port: conf.db_port,
		logging: false
	}),
	utils = require('./utils'),

	users = function() {
		var u = sql.define('users', {
			id: {
				type: db.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			username: {
				type: db.STRING,
				allowNull: true
			},
			email: {
				type: db.STRING
			},
			password: {
				type: db.STRING
			},
			active: {
				type: db.BOOLEAN,
				defaultValue: true
			}
		});
		if (process.env.INSTALL == 'true') {
			createTables(u);
		}
		return u;
	},

	// Create db table
	createTables = function(users) {
		users
			.sync()
			.on('success', function() {
			users.find({
				where: {
					email: "test@test.com"
				}
			}).success(function(dbres) {
				if (dbres) {
					console.log('Test user already exists!');
					process.kill(process.pid, 'SIGTERM'); // @todo not working
				}
				else {
					utils.hash('test_user', function(hash) {
						users.create({
							email: 'test@test.com',
							password: hash,
							active: 1
						}).success(function() {
							console.log('Tables created! You can start server without --install parameter.');
						});
					});
				}
			});
		})
			.on('error', function(e) {
			console.log('Something went wrong!', e);
		});
	};

module.exports.users = users;