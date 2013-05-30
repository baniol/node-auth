var nodemailer = require('nodemailer'),
	conf = require('../config'),

	mailer = {

		transport: nodemailer.createTransport("SMTP", {
			service: conf.smtp_service,
			auth: {
				user: conf.smtp_mail,
				pass: conf.smtp_password
			}
		})
	};

module.exports = mailer;