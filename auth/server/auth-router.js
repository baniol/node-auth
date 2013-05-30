var userModel = require('./userModel'),
	// conf = require('../config'),
	// clientSession,
	viewsPath = __dirname + '/views/',
	session;

// console.log(conf.getConfig);

var auth = {
	routes: function(app) {

		app.get('/', function(req, res) {
			res.redirect('/login');
		});

		app.get('/login', function(req, res) {
			if (req.session.user === undefined) {
				userModel.cookieLoginTry(req, res);
			}
			else {
				res.redirect('/home'); // @todo - to settings!
			}
		});

		app.post('/login', function(req, res) {
			userModel.loginTry(req, res, function(dbres) {
				session = dbres;
				req.session.user = dbres;
				// res.redirect('/home');
			});
		});

		app.get('/logout', function(req, res) {
			// @todo - check if logged in
			res.clearCookie('email');
			res.clearCookie('password');
			session = undefined;
			res.redirect('/login');
		});

		// REGISTER ROUTES
		// display register form
		app.get('/register', function(req, res) {
			res.render(viewsPath + 'register', {
				title: 'Register'
			});
		});

		app.post('/register', function(req, res) {
			userModel.registerAccount(req, function(e) {
				if (e) {
					res.send(e, 400);
				}
				else {
					res.send('ok', 200);
				}
			});
		});

		// app.get('/home', function(req, res) {
		// 	// console.log('asdf');
		// 	// console.log(req.session);
		//     if (session == null){
		//         res.redirect('/');
		//     }else{
		// 		res.render(viewsPath+'home', {
		// 			title : 'Control Panel',
		// 			userData : session
		// 		});
		//     }
		// });

		// app.post('/home',function(req,res){
		// 	userModel.editProfile(req,function(e){
		// 		if (e){
		// 			res.send(e, 400);
		// 		}else{
		// 			res.send('ok', 200);
		// 		}
		// 	});
		// });

		// display send email to reset password form
		app.get('/forgot-password', function(req, res) {
			res.render(viewsPath + 'forgot_password', {
				title: 'Forgot password'
			});
		});

		// send reset link to given email address
		app.post('/forgot-password', function(req, res) {
			var email = req.param('email');
			userModel.getAccountByEmail(email, function(o) {
				if (o) {
					res.send('ok', 200);
					userModel.sendLinkMail(o, function(e, m) {
						// this callback takes a moment to return //
						// should add an ajax loader to give user feedback //
						if (!e) {
							res.send('ok', 200);
						}
						else {
							res.send('email-server-error', 400);
						}
					});
				}
				else {
					res.send('email-not-found', 400);
				}
			});
		});

		app.get('/reset-password', function(req, res) {
			var email = req.query["e"];
			var passH = req.query["p"];
			// @todo - does validateresetlink work?
			userModel.validateResetLink(email, passH, function(e) {
				// res.send(e);return;
				if (e != 'ok') {
					res.redirect('/');
				}
				else {
					// save the user's email in a session instead of sending to the client //
					req.session.reset = {
						email: email,
						passHash: passH
					};
					res.render(viewsPath + 'reset_password');
				}
			});
		});

		app.post('/reset-password', function(req, res) {
			userModel.updatePassword(req, function(o) {
				if (o != 'ok') {
					// @todo - test on client side
					res.send('error', 400);
				}
				else {
					res.send('ok', 200);
				}
			});
		});

	},
	getSession: function() {
		return session;
	}
};



module.exports = auth;
// module.exports.getSession = getSession;