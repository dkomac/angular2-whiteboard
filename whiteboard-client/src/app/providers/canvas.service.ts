import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable() 
export class CanvasService {

	@Output() resetCanvasEvent: EventEmitter<any> = new EventEmitter();
	reset() {
		this.resetCanvasEvent.emit('reset-the-canvas-now')
	}

}