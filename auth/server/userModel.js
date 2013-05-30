var
check = require('validator').check,
	sanitize = require('validator').sanitize,
	users = require('./db').users(),
	utils = require('./utils'),
	mailer = require('./mailer'),
	conf = require('../config'),
	viewsPath = __dirname + '/views/',

	userModel = {
		loginTry: function(req, res, fn) {
			users.find({
				where: {
					email: req.param('email')
				}
			}).success(function(dbres) {
				if (dbres === null) {
					res.send('Incorrect email or password!', 400);
				}
				else {
					utils.validatePassword(req.param('password'), dbres.password, function(o) {
						if (o) {
							req.session.user = dbres;
							if (req.param('remember') == 'true') {
								res.cookie('email', dbres.email, {
									maxAge: 900000
								});
								// @todo - security breach ? not to store password in a cookie !
								res.cookie('password', dbres.password, {
									maxAge: 900000
								});
							}
							res.send('/' + conf.main_route, 200);
							fn(dbres);
						}
						else {
							res.send('Incorrect email or password!', 400);
						}
					});
				}
			});
		},

		cookieLoginTry: function(req, res) {
			users.find({
				where: {
					email: req.param('email')
				}
			}).success(function(dbres) {
				if (dbres === null) {
					res.render(viewsPath + 'login', {
						title: 'Login'
					});
				}
				else {
					if (dbres.password == req.param('password')) {
						req.session.user = o;
						res.redirect('/' + conf.main_route);
					}
					else {
						res.render(viewsPath + 'login', {
							title: 'Login'
						});
					}
				}
			});
		},

		registerAccount: function(req, fn) {
			req.assert('email', 'valid email required').isEmail();
			req.assert('password', '6 to 20 characters required').len(6, 20);
			req.assert('confirm').equals(req.body.password);

			var errors = req.validationErrors();
			// var mappedErrors = req.validationErrors(true);

			if (errors === null) {
				var email = req.sanitize('email').xss();
				var password = req.sanitize('password').xss();

				// db save
				// check if email is available
				users.find({
					where: {
						email: email
					}
				}).success(function(dbres) {
					if (dbres === null) {
						// email is free - save new user
						utils.hash(password, function(hash) {
							users.create({
								email: email,
								password: hash
							}).success(function(user) {
								fn(errors);
							});
						});
					}
					else {
						// return error
						errors = 'email-taken';
						fn(errors);
					}
				});
			}
			else {
				fn(errors);
			}
		},

		editProfile: function(req, fn) {
			req.assert('email', 'valid email required').isEmail();
			if (req.param('password') !== '') {
				req.assert('password', '6 to 20 characters required').len(6, 20);
				req.assert('confirm').equals(req.body.password);
			}

			var errors = req.validationErrors();
			// var mappedErrors = req.validationErrors(true);

			if (errors === null) {
				var userId = parseInt(req.param('userId'), 10);
				var email = req.sanitize('email').xss();
				if (req.param('password') !== '')
					var password = req.sanitize('password').xss();

				// db save
				// check if email is available
				users.find({
					where: ['email=? and id <>?', email, userId]
				}).success(function(dbres) {
					if (dbres === null) {
						users.find({
							where: {
								id: userId
							}
						}).success(function(dbres2) {
							if (req.param('password') !== '') {
								saltAndHash(password, function(hash) {
									dbres2.updateAttributes({
										password: hash,
										email: email
									}).success(function() {
										userModel.refreshUserSession(req, function() {
											fn(errors);
										});
									});
								});
							}
							else {
								dbres2.updateAttributes({
									email: email
								}).success(function() {
									userModel.refreshUserSession(req, function() {
										fn(errors);
									});
								});
							}
						});
					}
					else {
						// return error
						errors = 'email-taken';
						fn(errors);
					}
				});
			}
			else {
				fn(errors);
			}
		},

		// @todo to separate mailer module ??
		sendLinkMail: function(o, fn) {
			var link = conf.server_protocol + conf.server_domain + ':' + conf.server_port + '/reset-password?e=' + o.email + '&p=' + o.password;
			var html = "<html><body>";
			html += "Hi " + o.name + ",<br><br>";
			// html += "Your username is :: <b>"+o.user+"</b><br><br>";
			html += "<a href='" + link + "'>Please click here to reset your password</a><br><br>";
			html += "Cheers,<br>";
			html += "<a href='http://twitter.com/braitsch'>braitsch</a><br><br>";
			html += "</body></html>";

			console.log('Sending Mail... to: ' + o.email);

			// Message object
			var message = {
				from: 'Sender Name <marcin.baniowski@gmail.com>',
				// Comma separated list of recipients
				to: '"Receiver Name" <marcin@baniowski.pl>',
				// Subject of the message
				subject: 'Nodemailer is unicode friendly ✔', //
				headers: {
					'X-Laziness-level': 1000
				},
				// HTML body
				html: html
			};

			mailer.transport.sendMail(message, function(error) {
				if (error) {
					console.log('Error occured');
					console.log(error.message);
					return;
				}
				console.log('Message sent successfully!');
			});

			// if you don't want to use this transport object anymore, uncomment following line
			mailer.transport.close();
		},

		refreshUserSession: function(req, fn) {
			users.find({
				where: {
					id: req.session.user.id
				}
			}).success(function(dbres) {
				req.session.user = dbres;
				fn();
			});
		},

		getAccountByEmail: function(email, fn) {
			users.find({
				where: {
					email: email
				}
			}).success(function(dbres) {
				fn(dbres);
			});
			// accounts.findOne({email:email}, function(e, o){ callback(o); });
		},

		validateResetLink: function(email, passHash, fn) {
			users.find({
				where: {
					email: email,
					password: passHash
				}
			}).success(function(dbres) {
				fn(dbres === null ? null : 'ok');
			});
		},

		updatePassword: function(req, fn) {
			var password = req.param('password');

			// req.assert('email', 'required').notEmpty();
			req.assert('password', '6 to 20 characters required').len(6, 20);
			// req.assert('confirm').equals(req.body.password);

			var errors = req.validationErrors();

			if (errors === null) {
				// retrieve the user's email from the session to lookup their account and reset password //
				var email = req.session.reset.email;

				// destory the session immediately after retrieving the stored email //
				req.session.destroy();

				users.find({
					where: {
						email: email
					}
				}).success(function(dbres) {
					utils.hash(password, function(hash) {
						if (dbres) { // if the record exists in the db
							dbres.updateAttributes({
								password: hash
							}).success(function() {
								fn('ok');
							});
						}
					});
				});
			}
			else {
				fn(errors);
			}
		}

	};

module.exports = userModel;