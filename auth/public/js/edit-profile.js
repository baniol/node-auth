(function() {

	$('#register-form').submit(function(e) {
		e.preventDefault();
		reg.sendData();
	});


	var reg = {

		submitButton: $('#register-submit'),
		sendData: function() {
			var email = $('input[name=email]').val();
			var password = $('input[name=password]').val();
			var confirm = $('input[name=password-confirm]').val();
			var userId = $('#userId').val();
			reg.blockSubmit();

			$.ajax({
				url: '/home',
				method: 'post',
				data: {
					password: password,
					email: email,
					confirm: confirm,
					userId: userId
				},
				success: function(e) {
					if (e == 'ok') {
						// redirect to login page with message
						reg.showAlert('Your profile has been succesfully updated!', 'success');
						reg.unblockSubmit();
					}
				},
				error: function(e) {
					if (e.responseText == 'db_error') {
						reg.showAlert('There has been an arror when writting data do data base!');
					}
					else if (e.responseText == 'email-taken') {
						reg.showAlert('Email already taken!');
					}
					else {
						reg.serveErrors(e.responseText);
					}
					reg.unblockSubmit();
				}
			});
		},

		blockSubmit: function() {
			reg.submitButton.text('Sending...').attr('disabled', true);
		},

		unblockSubmit: function() {
			reg.submitButton.text('Register').attr('disabled', false);
		},

		serveErrors: function(e) {
			var form = $('#register-form fieldset .control-group');
			form.removeClass('error');
			form.find('.help-inline').text('');
			form.each(function(k, v) {
				reg.matchError(e, $(v));
			});
		},

		showAlert: function(msg, type) {
			var alert = $('#reg-alert');
			alert.removeClass('hidden');
			if (type !== undefined) {
				alert.removeClass('alert-error').addClass('alert-' + type);
			}
			alert.find('strong').text(msg);
		},

		matchError: function(e, el) {
			var errors = JSON.parse(e);
			$.each(errors, function(k, v) {
				var par = v.param + '-cg';
				if (par == el.attr('id')) {
					el.addClass('error');
					el.find('.help-inline').text(v.msg);
				}
			});
		}
	};

})();