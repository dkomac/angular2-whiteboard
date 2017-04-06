'use strict';

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const serverPort = 5000;

let rooms = ["room1", "room2", "room3"];

io.on('connection', (socket) => {
  console.log('user connected');

  //send roomlist to connected user
  io.emit('roomlist', {type:'roomlist', data: rooms});

  socket.on('join-room', (room) => {
  	console.log("socket:", socket.id, "is trying to join room: ", room)
  	socket.join(room);
    console.log(Object.keys( io.sockets.adapter.sids[socket.id])[1])
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {type:'new-message', text: message});    
  });

  socket.on('send-mousepos', (mousePos, settings) => {
    io.to(Object.keys( io.sockets.adapter.sids[socket.id])[1]).emit('new-line', {type: 'new-line', data: mousePos, settings: settings});
  })

  socket.on('get-roomlist', () => {
    io.emit('roomlist', {type:'roomlist', data: rooms});
  })

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('leave-room', (room) => {
  	socket.leave(room)
  	console.log(socket.id, "=> left room:", room)
  })

});

http.listen(serverPort, () => {
  console.log(`started on port ${serverPort}`);
});


let displayUsers = () => {
	console.log(`Sending messaged to all rooms`);
	rooms.map( room => {
		io.to(room).emit('message', {type:'new-message', text: `Sending this message in room: ${room}`})
	})
};

setInterval(displayUsers, 20000);