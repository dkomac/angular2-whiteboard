import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../providers/socket.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

	
	canvasData: any = { width: 1200, height: 800}
	connection;

  	constructor(private _socketService: SocketService,
  				private _router: Router) { 
  		if(!this._socketService._socketRoom) {
  			this._router.navigate(['roomlist']);
  		}
  	}

	ngOnInit() {
		
	}

	goBackToLobby() {
		this._socketService.leaveRoom();
		this._router.navigate(['roomlist']);
	}

}
