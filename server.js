var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientinfo = {};

io.on('connection',function(socket){
	console.log('User connected!!!');
	
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
		message.timestamp = moment().valueOf();
		io.to(clientinfo[socket.id].room).emit('message', message);
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