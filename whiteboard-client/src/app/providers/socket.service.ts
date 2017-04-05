import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class SocketService {
  private url = 'http://localhost:5000';  
  private socket;
  public _socketRoom;
  
  sendMessage(message){
    this.socket.emit('add-message', message);    
  }

  joinRoom(room) {
      this.socket.emit('join-room', room);
  }

  leaveRoom() {
      this.socket.emit('leave-room', this._socketRoom);
  }
  
  setupSocket() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);

      this.socket.on('roomlist', (data) => {
        observer.next(data);
      });

      this.socket.on('message', (data) => {
        observer.next(data);    
      });


      return () => {
        this.socket.disconnect();
      };  
    })     
    return observable;
  }
}