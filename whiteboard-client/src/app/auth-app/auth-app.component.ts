import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { RoomComponent } from '../room/room.component';
import { RoomlistComponent } from '../roomlist/roomlist.component';

@Component({
  selector: 'app-auth-app',
  templateUrl: './auth-app.component.html',
  styleUrls: ['./auth-app.component.scss']
})
export class AuthAppComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

export const APP_ROUTES: Routes = [
	{ path:'', component: RoomComponent },
	{ path:'room', component: RoomComponent },
	{ path:'roomlist', component: RoomlistComponent }
];
