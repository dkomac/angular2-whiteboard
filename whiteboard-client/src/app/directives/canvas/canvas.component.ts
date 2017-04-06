import { Component, Input, HostListener, ElementRef, ViewChild } from '@angular/core';
import { UserSettingService } from '../../providers/user.setting.service';
import { CanvasService } from '../../providers/canvas.service';
import { SocketService } from '../../providers/socket.service';
import { socketTypes } from '../../interfaces/socket-types.interface';
import { roomData } from '../../interfaces/roomdata.interface';

@Component({
	selector: 'canvasComponent',
	templateUrl:'./canvas.html',
	styleUrls: ['./canvas.scss'],
})
export class CanvasComponent {

	@Input() canvasMeta: any;
	@ViewChild("canvasComponent") canvasComponent: ElementRef;
	private _ctx: CanvasRenderingContext2D;
	private _canvasWidth;
	private _canvasHeight;

	private _mouseDown: boolean = false;
	private _mousePosition = {
		oldX: 0,
		oldY: 0,
		newX: 0,
		newY: 0,
		settings: {color: '', size: 0}
	};
	


	constructor(private _userSettings: UserSettingService,
				private _resetCanvasService: CanvasService,
				private _socketService: SocketService) {
		this._resetCanvasService.resetCanvasEvent.subscribe( event => {
			this.clearCanvas();
		});

		this._socketService._socketObservable.subscribe( (socketMessage:socketTypes)=> {
			switch (socketMessage.type) {
				case 'new-line':
					this.drawLine(socketMessage.data);
					break;
				case 'room-data':
					socketMessage.data.data.forEach( obj => this.drawLine(obj))
					break;	
				case 'reset-canvas':
					this.clearCanvas();
					break;
			}
			
		})
	}

	clearCanvas() {
		console.log("clear canvas", this._ctx.canvas.width, this._ctx.canvas.height)
		this._ctx.clearRect(0,0, this._ctx.canvas.width, this._ctx.canvas.height);
	}

	ngOnInit() {
		console.log("canvasMeta", this.canvasMeta)
		//this._canvasWidth = this.canvasMeta.width;
		//this._canvasHeight = this.canvasMeta.height;
		this._ctx = this.canvasComponent.nativeElement.getContext("2d");
		this._ctx.canvas.width = this.canvasMeta.width;
		this._ctx.canvas.height = this.canvasMeta.height;
	}

	@HostListener('mousedown')
	onMousedown() {
		this._mouseDown = true;
	}

	@HostListener('mouseup')
	onMouseup() {
		this._mouseDown = false;
	}

	@HostListener('mousemove', ['$event'])
	onMousemove(event: MouseEvent) {

		if(this._mouseDown) {

			this._mousePosition.oldX = this._mousePosition.newX;
			this._mousePosition.oldY = this._mousePosition.newY;

			this._mousePosition.newX = event.clientX - this.canvasComponent.nativeElement.getBoundingClientRect().left;
			this._mousePosition.newY = event.clientY - this.canvasComponent.nativeElement.getBoundingClientRect().top;

			this._mousePosition.settings.size = this._userSettings._penSize;
			this._mousePosition.settings.color = this._userSettings._penColor;

			this._socketService.sendMousePos(this._mousePosition);
			this.drawLine(this._mousePosition);

		} else {
			this._mousePosition.newX = event.clientX - this.canvasComponent.nativeElement.getBoundingClientRect().left;
			this._mousePosition.newY = event.clientY - this.canvasComponent.nativeElement.getBoundingClientRect().top;
		}


	}

	drawLine(mousePos) {
			this._ctx.beginPath();
			this._ctx.lineWidth = mousePos.settings.size;
	        this._ctx.lineCap = 'round';
	        this._ctx.lineJoin = 'round';
			this._ctx.strokeStyle = mousePos.settings.color;
			this._ctx.moveTo(mousePos.oldX, mousePos.oldY);
			this._ctx.lineTo(mousePos.newX, mousePos.newY);
			this._ctx.stroke();
	}







}