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
	private _canvasPoints = [];

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
					console.log("NEW LINE",socketMessage.data)
					this.drawLine(socketMessage.data);
					break;
				case 'room-data':
					//this._canvasPoints = socketMessage.data.data;
					console.log(socketMessage.data.data)
					this.drawLine(socketMessage.data.data);
					
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
		this._socketService.startDrawing();
	}

	@HostListener('mouseup')
	onMouseup() {
		this._mouseDown = false;
		this._socketService.endDrawing();
	}

	@HostListener('mousemove', ['$event'])
	onMousemove(event: MouseEvent) {

		if(this._mouseDown) {

			/*
			this._mousePosition.oldX = this._mousePosition.newX;
			this._mousePosition.oldY = this._mousePosition.newY;

			this._mousePosition.newX = event.clientX - this.canvasComponent.nativeElement.getBoundingClientRect().left;
			this._mousePosition.newY = event.clientY - this.canvasComponent.nativeElement.getBoundingClientRect().top;
			*/
			this._mousePosition.settings.size = this._userSettings._penSize;
			this._mousePosition.settings.color = this._userSettings._penColor;

			this._canvasPoints.push({
				x:event.clientX - this.canvasComponent.nativeElement.getBoundingClientRect().left, 
				y:event.clientY - this.canvasComponent.nativeElement.getBoundingClientRect().top,
				settings: { size: this._userSettings._penSize, color: this._userSettings._penColor}
			})

			this._socketService.sendMousePos(this._canvasPoints);

			this.drawLine(this._canvasPoints);

		} else {
			this._canvasPoints = [];
			this._mousePosition.newX = event.clientX - this.canvasComponent.nativeElement.getBoundingClientRect().left;
			this._mousePosition.newY = event.clientY - this.canvasComponent.nativeElement.getBoundingClientRect().top;
		}


	}

	drawLine(drawData) {
		/*
		console.log(mousePos.oldX - mousePos.newX);
		this._ctx.beginPath();
		this._ctx.lineWidth = mousePos.settings.size;
        this._ctx.lineCap = 'round';
        this._ctx.lineJoin = 'round';
        this._ctx.shadowBlur = 2;
  		this._ctx.shadowColor = mousePos.settings.color;
		this._ctx.strokeStyle = mousePos.settings.color;
		this._ctx.moveTo(mousePos.oldX, mousePos.oldY);
		this._ctx.lineTo(mousePos.newX, mousePos.newY);
		this._ctx.stroke();
		*/
		if(drawData.length < 1) {
			return;
		}
		let p1 = drawData[0];
		let p2 = drawData[1];

		this._ctx.beginPath();
  		this._ctx.moveTo(p1.x, p1.y);

  		for (var i = 1, len = drawData.length; i < len; i++) {
	  		let midPoint = this.midPointBtw(p1, p2);
	  		this._ctx.lineCap = 'round';
	        this._ctx.lineJoin = 'round';
	        this._ctx.lineWidth = drawData[i].settings.size;
	        this._ctx.shadowBlur = 2;
	  		this._ctx.shadowColor = drawData[i].settings.color;
			this._ctx.strokeStyle = drawData[i].settings.color;
	    	this._ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
	    	p1 = drawData[i];
    		p2 = drawData[i+1];
	  	}

	  	//this._ctx.lineTo(p1.x, p1.y);
  		this._ctx.stroke();
	}

	midPointBtw(p1, p2) {
		return {
			x: p1.x + (p2.x - p1.x) / 2,
			y: p1.y + (p2.y - p1.y) / 2
		};
	}







}