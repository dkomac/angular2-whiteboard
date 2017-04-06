'use strict';

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const serverPort = 5000;

let rooms = [{name:"room1", data:[]}, {name:"room2", data:[]}, {name:"room3", data:[]}];

io.on('connection', (socket) => {
  console.log('user connected');

  //send roomlist to connected user
  io.emit('roomlist', {type:'roomlist', data: rooms});

  socket.on('join-room', (room) => {
  	console.log("socket:", socket.id, "is trying to join room: ", room)
  	socket.join(room);
    socket.emit('room-data', getRoom(socket.id));
    console.log(Object.keys( io.sockets.adapter.sids[socket.id])[1])
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {type:'new-message', text: message});    
  });

  socket.on('send-mousepos', (mousePos) => {
    io.to(getRoomName(socket.id)).emit('new-line', {type: 'new-line', data: mousePos});
    let room = rooms.find( room => room.name === getRoomName(socket.id));
    room.data.push(mousePos);
    console.log(room)
  })

  socket.on('get-roomlist', () => {
    io.emit('roomlist', {type:'roomlist', data: rooms});
  })

  socket.on('reset-canvas', (room) => {
      let room = getRoom(socket.id);
      room.data = [];

      io.to(getRoomName(socket.id)).emit('clear-canvas');
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

let getRoomName = socketid => {
  return Object.keys( io.sockets.adapter.sids[socketid])[1];
}

let getRoom = socketid => {
  return rooms.find( room => room.name === getRoomName(socketid));
}

let displayUsers = () => {
	console.log(`Sending messaged to all rooms`);
	rooms.map( room => {
		io.to(room).emit('message', {type:'new-message', text: `Sending this message in room: ${room}`})
	})
};

setInterval(displayUsers, 20000);