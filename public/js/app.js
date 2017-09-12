var socket = io(); 

socket.on('connect',function(){
	console.log('Connected to Server.....');
});

socket.on('message', function(message){
	console.log('New Message :');
	console.log(message);
	
	jQuery('.messages').append('<p>'+ message.text +'</p>');
});

//Handles submitting new messages
var $form = jQuery('#message-form');

$form.on('submit', function(event){
	event.preventDefault();
	
	var $message = $form.find('input[name=message]');
	socket.emit('message', {
		text: $message.val()
	});
	
	$message.val('');
});