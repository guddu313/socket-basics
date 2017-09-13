var socket = io(); 

socket.on('connect',function(){
	console.log('Connected to Server.....');
});

socket.on('message', function(message){
	var momentTimestamp = moment.utc(message.timestamp);
	console.log('New Message :');
	console.log(message.text);
	
	jQuery('.messages').append('<p><strong>' + momentTimestamp.local().format('h:mm A') + ': </strong>' + message.text +'</p>');
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