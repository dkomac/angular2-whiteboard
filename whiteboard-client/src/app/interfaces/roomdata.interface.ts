export interface roomData {
	name: string,
	data: mouseData[]
}

export interface mouseData {
		oldX: number,
		oldY: number,
		newX: number,
		newY: number,
		settings: mouseSettings
}

export interface mouseSettings {
	color: string, 
	size: number
}