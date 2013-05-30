$(document).ready(function() {

	$('#login-form').submit(function(e) {
		var email = $('input[name=email]').val();
		var password = $('input[name=password]').val();
		var remember = $('input[name=remember-me]:checked').val();
		e.preventDefault();

		$.ajax({
			url: '/login',
			method: 'post',
			data: {
				password: password,
				email: email,
				remember: remember
			},
			success: function(e) {
				window.location.href = e;
			},
			error: function(e) {
				var alert = $('#log-alert');
				alert.removeClass('hidden');
				alert.find('strong').text(e.responseText);
			}
		});

	});
});