$(document).ready(function() {
	var submitButton = $('button[type=submit]');
	$('#password-form').submit(function(e) {
		e.preventDefault();
		blockSubmit();
		var input = $('input[name=email]');
		if (input.val() === '') {
			forgotAlert('Provide a valid email address!');
			return false;
		}
		else {
			forgotAlert('hide');
		}
		$.ajax({
			url: '/forgot-password',
			method: 'post',
			data: {
				email: input.val()
			},
			success: function(e) {
				forgotAlert('An email with reset ling has been sent!', 'success');
				setTimeout(function() {
					window.location.href = '/';
				}, 2000);
			},
			error: function(e) {
				if (e.responseText == 'email-not-found') {
					forgotAlert('Email not found!');
				}
				else {
					forgotAlert('There has been an error!');
				}
				unblockSubmit();
			}
		});
	});

	function forgotAlert(msg, type) {
		var alert = $('#alert');
		if (msg == 'hide') {
			alert.addClass('hidden');
		}
		else {
			alert.removeClass('hidden');
			if (type !== undefined) {
				alert.removeClass('alert-error').addClass('alert-' + type);
			}
			alert.find('strong').text(msg);
		}
	}

	function blockSubmit() {
		submitButton.text('Sending...').attr('disabled', true);
	}

	function unblockSubmit() {
		submitButton.text('Send').attr('disabled', false);
	}
});