const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
	console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', socket => {
	console.log('New client! Its id – ' + socket.id);
	socket.on('logged', user => {
		users.push(user);
		console.log(users);
		socket.broadcast.emit('message', {
			author: 'Chat Bot',
			content: `${user.name} has joined the conversation!`,
		});
	});
	socket.on('message', message => {
		console.log("Oh, I've got something from " + socket.id);
		messages.push(message);
		socket.broadcast.emit('message', message);
	});
	socket.on('disconnect', () => {
		const disconnectedUser = users.findIndex(user => user.id === socket.id);
		console.log('Oh, user ' + users[disconnectedUser]?.name + ' has left');
		socket.broadcast.emit('loggedOff', {
			author: 'Chat Bot',
			content: `${users[disconnectedUser]?.name} has left the conversation!`,
		});
		users.splice(disconnectedUser, 1);
	});
	console.log("I've added a listener on message and disconnect events \n");
});
