import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class SocketService {
    private url = 'http://localhost:5000';  
    private socket;
    public _socketRoom;
    public _socketObservable;

    constructor() {
        this.socket = io(this.url);

        this._socketObservable = new Observable(observer => {

            this.socket.on('message', (data) => {
                observer.next(data);    
            });

            return () => {
                this.socket.disconnect();
            };  
        })     
    }
    
    sendMessage(message){
        this.socket.emit('add-message', message);    
    }

    joinRoom(room) {
        this.socket.emit('join-room', room);
    }

    leaveRoom() {
        this.socket.emit('leave-room', this._socketRoom);
    }

    sendMousePos(mousePos) {
        this.socket.emit('send-mousepos', mousePos)
    }

    getRoomList() {
        this.socket.emit('get-roomlist');
    }

    resetCanvas() {
        this.socket.emit('reset-canvas')
    }

}