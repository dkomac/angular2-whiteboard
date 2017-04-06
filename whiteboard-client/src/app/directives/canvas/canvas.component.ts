import { Component, Input, HostListener, ElementRef, ViewChild } from '@angular/core';
import { UserSettingService } from '../../providers/user.setting.service';
import { CanvasService } from '../../providers/canvas.service';
import { SocketService } from '../../providers/socket.service';
import { socketTypes } from '../../interfaces/socket-types.interface';

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
		newY: 0
	};
	


	constructor(private _userSettings: UserSettingService,
				private _resetCanvasService: CanvasService,
				private _socketService: SocketService) {
		this._resetCanvasService.resetCanvasEvent.subscribe( event => {
			this.clearCanvas();
		});

		this._socketService.canvasObservable().subscribe( (mouseData:socketTypes)=> {
			this.drawLine(mouseData.data);
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
			console.log("mousemove", this.canvasComponent.nativeElement.getBoundingClientRect().left)

			this._mousePosition.oldX = this._mousePosition.newX;
			this._mousePosition.oldY = this._mousePosition.newY;

			this._mousePosition.newX = event.clientX - this.canvasComponent.nativeElement.getBoundingClientRect().left;
			this._mousePosition.newY = event.clientY - this.canvasComponent.nativeElement.getBoundingClientRect().top;

			this._socketService.sendMousePos(this._mousePosition);
			this.drawLine(this._mousePosition);

			/*
			this._ctx.beginPath();
			this._ctx.lineWidth = this._userSettings._penSize;
	        this._ctx.lineCap = 'round';
	        this._ctx.lineJoin = 'round';
			this._ctx.strokeStyle = this._userSettings._penColor;
			this._ctx.moveTo(this._mousePosition.oldX, this._mousePosition.oldY);
			this._ctx.lineTo(this._mousePosition.newX, this._mousePosition.newY);
			this._ctx.stroke();
			*/



		} else {
			this._mousePosition.newX = event.clientX - this.canvasComponent.nativeElement.getBoundingClientRect().left;
			this._mousePosition.newY = event.clientY - this.canvasComponent.nativeElement.getBoundingClientRect().top;
		}


	}

	drawLine(mousePos) {
			this._ctx.beginPath();
			this._ctx.lineWidth = this._userSettings._penSize;
	        this._ctx.lineCap = 'round';
	        this._ctx.lineJoin = 'round';
			this._ctx.strokeStyle = this._userSettings._penColor;
			this._ctx.moveTo(mousePos.oldX, mousePos.oldY);
			this._ctx.lineTo(mousePos.newX, mousePos.newY);
			this._ctx.stroke();
	}







}