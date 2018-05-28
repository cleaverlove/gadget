
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
	// res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname + '/index.html');
})

var userNum = 0;

io.on('connection', function(socket) {

	socket.userId = socket.id;
	++userNum;
	io.emit('joinChat', {userId: socket.userId, userNum: userNum});

	socket.on('chat message', function(data) {
		// io.emit('chat message', data); //广播到每一个socket
		socket.broadcast.emit('chat message', data); //广播到每一个socket，除了本身
	})
	console.log('a user connected');
	socket.on('disconnect', function() {
		console.log('user disconnect');
	})
	
})

http.listen(port, function() {
	console.log('监听成功');
})
