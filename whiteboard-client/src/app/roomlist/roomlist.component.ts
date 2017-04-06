import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { SocketService } from '../providers/socket.service';

import { socketTypes } from '../interfaces/socket-types.interface';

@Component({
  selector: 'app-roomlist',
  templateUrl: './roomlist.component.html',
  styleUrls: ['./roomlist.component.scss']
})
export class RoomlistComponent implements OnInit {

	_roomlist:any;
  	constructor(private _router: Router,
  			  	private _socketService: SocketService) { }

	ngOnInit() {
	  	this._socketService.setupSocket().subscribe( (message: socketTypes) => {
	  		switch (message.type) {
	  			case "roomlist":
	  				this._roomlist = message.data;
	  				break;

  				case "new-message":
	  				console.log(message);
	  				break;

	  			default:
	  				console.log("---- help ----");
	  				console.log(message)
	  				console.log("--------------");
	  				break;
	  		}

	  	})

	  	
  		this._socketService.getRoomList();
	  	
	}

	joinRoom(room) {
		this._socketService.joinRoom(room);
		this._socketService._socketRoom = room;
		this._router.navigate(['room']);
		console.log("trying to joing room: ", room);
	}

}
