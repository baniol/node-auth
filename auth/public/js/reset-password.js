$(document).ready(function(){
	var submitButton = $('button[type=submit]');
	$('#reset-form').submit(function(e){
		var password = $('input[name=password]').val();
		e.preventDefault();
		blockSubmit();
		$.ajax({
			url:'/reset-password',
			method:'post',
			data:{password:password},
			success:function(e){
				if(e == 'ok'){
					// @todo - authenticate without manual login
					showAlert('Your password has been reset! You can now login.','success');
					setTimeout(function(){
						window.location.href = '/';
					},2000);
				}else{
					showAlert('There has been an error!');
					unblockSubmit();
				}
			},
			error: function(e){
				showAlert('Password must contain 6 to 20 characters!');
				unblockSubmit();
			}
		});

	});

	function showAlert(msg,type){
		var alert = $('#alert');
		if(msg == 'hide'){
			alert.addClass('hidden');
		}else{
			alert.removeClass('hidden');
			if(type !== undefined){
				alert.removeClass('alert-error').addClass('alert-'+type);
			}
			alert.find('strong').text(msg);
		}
	}

	function blockSubmit(){
		submitButton.text('Sending...').attr('disabled',true);
	}

	function unblockSubmit(){
		submitButton.text('Reset').attr('disabled',false);
	}

});