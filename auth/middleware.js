var notSecured = ['/register','/login'],
	routesArray = [],
	auth = require('./server/auth-router'),
	config = require('./config');


module.exports = {

	configuration: function(conf){
		config.setConfig(conf);
	},

	middleware: function(req,res,next){
		auth.routes(req.app);
		var session = auth.getSession();
		if(routesArray.length == 0){
			getPahts(req.app._router.map.get);
		}
	    if(routesArray.indexOf(req.path) != -1 && notSecured.indexOf(req.path) == -1 && (session === undefined)){
	        res.render(__dirname+'/server/views/login',{title:"Login"});
	        res.end();
	    }else{
	    	console.log('zalogowany');
	   	 	next();
	    }
	}
};

getPahts = function(map){
	map.forEach(function(p){
		routesArray.push(p.path);
	});
};

// module.exports = middleware;