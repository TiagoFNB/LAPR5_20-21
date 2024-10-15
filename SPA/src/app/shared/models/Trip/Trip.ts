import { identifierModuleUrl } from "@angular/compiler";
import { TripInterface } from "./TripInterface";

export class Trip {
	private _pathId: string;
	private _lineId: string;
	private _startingTime: number;
	private _endTime?: number;
	private _frequency?: number;
	private constructor(
		pathId: string,
		lineId: string,
		startingTime: number,
		endTime?: number,
		frequency?: number
	) {
		this.validate(pathId, lineId, startingTime, endTime, frequency);
		this._pathId = pathId;
		this._lineId = lineId;
		this._startingTime = startingTime;
		if (endTime != undefined && frequency != undefined) {
			this._endTime = endTime;
			this._frequency = frequency;
		}
	}

	public static Create(obj: TripInterface) {
		let trip = new Trip(
			obj.PathId,
			obj.LineId,
			obj.StartingTime,
			obj.EndTime,
			obj.Frequency
		);

		return trip;
	}

	private validate(
		pathId: string,
		lineId: string,
		startingTime: number,
		endTime: number,
		frequency: number
	) {

		if (lineId) {
			if (lineId.length < 0) {
				throw new Error('LineId must contain some characters');
			}
		} else {
			throw new Error('LineId Must be  defined ');
		}
		
		if (pathId) {
			if (pathId.length < 0) {
				throw new Error('PathId must contain some characters');
			}
		} else {
			throw new Error('PathId Must be  defined ');
		}

		if (startingTime) {
			if (startingTime < 0) {
				throw new Error('Starting time cant be 0');
			}
		} else {
			throw new Error('Starting time must be  defined ');
		}

		if(endTime != undefined){
			if(endTime<startingTime){
				throw new Error('End time cant be lower than starting time');
			}
		}

		if((endTime == undefined &&frequency != undefined)||(endTime != undefined && frequency ==undefined)){
			throw new Error('End time and frequency must be both filled');
		}
	}

	public get PathId() {
		return this._pathId;
	}
	public get LineId() {
		return this._lineId;
	}
	public get StartingTime() {
		return this._startingTime;
	}
	public get EndTime() {
		return this._endTime;
	}
	public get Frequency() {
		return this._frequency;
	}
}
