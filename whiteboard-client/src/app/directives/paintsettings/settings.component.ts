import { Component, Input, HostListener, ElementRef, ViewChild, Output, EventEmitter, OnChanges } from '@angular/core';
import { UserSettingService } from '../../providers/user.setting.service';
import { CanvasService } from '../../providers/canvas.service';
import { SocketService } from '../../providers/socket.service';
import { socketTypes } from '../../interfaces/socket-types.interface';

@Component({
	selector: 'settingsComponent',
	templateUrl:'./settings.html',
	styleUrls: ['./settings.scss'],
})
export class SettingsComponent implements OnChanges {

	
	private _colorOptions: any = ["red", "blue", "black", "orange", "yellow", "green"]
	private _activeColor: any;
	private _activePenSize: any;
	constructor(private _userSettings: UserSettingService,
				private _CanvasService: CanvasService,
				private _socketService: SocketService) {
		
	}

	ngOnInit() {
	}

	ngOnChanges() {
		this._userSettings._penSize = this._activePenSize;
		console.log(this._userSettings._penSize,this._activePenSize)
	}

	setColor(color) {
		this._userSettings._penColor = color;
		this._activeColor = color;
	}

	onSliderChange(event) {
		this._userSettings._penSize = event.value;
	}

	resetCanvas() {
		this._socketService.resetCanvas();
	}

}