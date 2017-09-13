var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientinfo = {};

//Send current users to socket
function sendCurrentUsers(socket)
{
	var info = clientinfo[socket.id];
	var users = [];
	
	if(typeof info === 'undefined')
	{
		return;
	}
	
	//in-built methods Object.keys
	Object.keys(clientinfo).forEach( function(socketId){
		var userinfo = clientinfo[socketId];
		
		if(info.room === userinfo.room)
		{
			users.push(userinfo.name);
		}
	});
	
	socket.emit('message', {
		name: 'System',
		text: 'Current users ' + users.join(', '),
		timestamp: moment().valueOf()
	});
}

io.on('connection',function(socket){
	console.log('User connected!!!');
	
	socket.on('disconnect', function(){
		
		var userData = clientinfo[socket.id];
		
		if(typeof userData !== undefined)
		{
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left!',
				timestamp: moment().valueOf()
			});
			
			delete clientinfo[socket.id];
		}
	});
	
	socket.on('joinRoom', function(req){
		clientinfo[socket.id] = req;
		//Join to the specific room
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message',{
			name: 'System',
			text: req.name + ' has joined!',
			timestamp: moment().valueOf()
		});
	});

	socket.on('message', function(message){
		console.log('Message Received:' + message.text);
		
		if(message.text === '@currentUsers')
		{
			sendCurrentUsers(socket);
		}
		else
		{
			message.timestamp = moment().valueOf();
			io.to(clientinfo[socket.id].room).emit('message', message);			
		}
	});
	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the Chat Application!',
		timestamp: moment().valueOf()
	});
});


http.listen(PORT, function(){
	console.log('Server started!!!');
});