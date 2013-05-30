var crypto = require('crypto'),

	utils = {
		generateSalt: function() {
			var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
			var salt = '';
			for (var i = 0; i < 10; i++) {
				var p = Math.floor(Math.random() * set.length);
				salt += set[p];
			}
			return salt;
		},

		// @todo change to sha1
		md5: function(str) {
			return crypto.createHash('md5').update(str).digest('hex');
		},

		hash: function(pass, callback) {
			var salt = utils.generateSalt();
			if (typeof callback == 'function')
				callback(salt + utils.md5(pass + salt));
		},

		validatePassword: function(plainPass, hashedPass, callback) {
			var salt = hashedPass.substr(0, 10);
			var validHash = salt + utils.md5(plainPass + salt);
			callback(hashedPass === validHash);
		}
	};

module.exports = utils;