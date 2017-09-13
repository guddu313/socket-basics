var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io(); 

if(name && room)
{
	console.log(name + ' wants to join ' + room);
}


socket.on('connect',function(){
	console.log('Connected to Server.....');
});

socket.on('message', function(message){
	var momentTimestamp = moment.utc(message.timestamp);
	var $message = jQuery('.messages');
	console.log('New Message :');
	console.log(message.text);
	
	$message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm A') +'</strong></p>');
	$message.append('<p>' + message.text + '</p>');
});

//Handles submitting new messages
var $form = jQuery('#message-form');

$form.on('submit', function(event){
	event.preventDefault();
	
	var $message = $form.find('input[name=message]');
	socket.emit('message', {
		name: name,
		text: $message.val()
	});
	
	$message.val('');
});