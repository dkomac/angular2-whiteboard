'use strict';

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const serverPort = 5000;

let rooms = [{name:"room1", data:[]}, {name:"room2", data:[]}, {name:"room3", data:[]}];

io.on('connection', (socket) => {
  console.log('user connected');

  //send roomlist to connected user
  io.emit('message', {type:'roomlist', data: rooms});

  socket.on('join-room', (room) => {
  	socket.join(room);
    socket.emit('message', {type:'room-data', data:getRoom(socket.id)});
    console.log("user:", socket.id, "joined room:", Object.keys( io.sockets.adapter.sids[socket.id])[1])
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {type:'new-message', text: message});    
  });

  socket.on('send-mousepos', (mouseData) => {
    io.to(getRoomName(socket.id)).emit('message', {type: 'new-line', data: mouseData});
    let room = rooms.find( room => room.name === getRoomName(socket.id));
    if(room) {
        room.data.push(mouseData);
    }
  })

  socket.on('get-roomlist', () => {
    io.emit('message', {type:'roomlist', data: rooms});
  })

  socket.on('reset-canvas', (room) => {
      getRoom(socket.id).data = [];

      io.to(getRoomName(socket.id)).emit('message', {type:'reset-canvas', data:null});
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
