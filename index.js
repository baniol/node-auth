/**
 * universal login system template for nodejs
 * Author : Marcin Baniowski
 * More Info : http://baniowski.pl
 */

process.env.INSTALL = process.argv[2] == '--install' ? true : false;

var express = require('express'),
	http = require('http'),
	app = express(),
	path = require('path'),
	lessMiddleware = require('less-middleware'),
	expressValidator = require('express-validator'),
	rootPath = path.resolve(),
	conf = require('./auth/config'),
	sessionStore = new express.session.MemoryStore(),

	auth = require('./auth/middleware'),

	authMiddleware = auth.middleware;

auth.configuration({
	server_protocol: 'http://',
	server_domain: 'localhost',
	server_port: 8080,
	main_route: 'home',
	// database settings
	db_username: '',
	db_dbname: '',
	db_password: '',
	db_host: 'localhost',
	db_port: 3306,
	// smtp settings
	smtp_password: '',
	smtp_mail: '',
	smtp_service: ''
});

// express settings - production
app.configure(function() {
	app.set('port', conf.server_port);
	app.set('views', __dirname + '/application/views');
	app.set('view engine', 'jade');
	var bootstrapPath = path.resolve('node_modules', 'bootstrap');
	app.locals.pretty = true;

	app.use(authMiddleware);

	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		store: sessionStore,
		secret: 'your_session_secret'
	}));
	app.use(express.methodOverride()); // @todo ??
	app.use(expressValidator);
	app.use(express.static(path.join(__dirname, 'auth', 'public')));
	app.use(app.router);
	app.use(lessMiddleware({
		// compress : true
		src: path.resolve(__dirname, 'auth', 'public', 'stylesheets'),
		paths: [path.join(bootstrapPath, 'less')],
		dest: path.resolve(__dirname, 'auth', 'public', 'stylesheets'),
		prefix: '/stylesheets'
	}));
});

// if(!process.env.INSTALL){
http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
// }

// require('./auth/server/auth-router')(app);

app.get('/home', function(req, res) {
	res.render('home', {
		title: 'Control Panel',
		userData: req.session.user
	});
});

// process.on('SIGTERM', function () {
//   console.log("Closing");
//   http.close();
// });