import { NgIf } from '@angular/common';
import { Injectable } from '@angular/core';

import { RegisterTripDto } from 'src/app/shared/models/Trip/Dto/RegisterTripDto';
import { Trip } from 'src/app/shared/models/Trip/Trip';

@Injectable({ providedIn: 'root' })
export class RegisterTripMapperService {
	public constructor() { }
	public FromModelToDto(trip: any): RegisterTripDto {
		let registerTripDto: any = {
			PathId: trip.pathId,
			LineId: trip.lineId,
			StartingTime: trip.startingTime,
		};

		//StartingTime, EndTime and frequency needs to be transform to seconds and number
		registerTripDto.StartingTime = this.transformStringHourMinToSeconds(trip.startingTime);
		if (trip.endingTime != undefined && trip.frequency != undefined) {
			registerTripDto.EndTime = this.transformStringHourMinToSeconds(trip.endingTime);
			registerTripDto.Frequency = this.transformStringHourMinToSeconds(trip.frequency);
		}

		return registerTripDto;
	}

	public FromDtoToPersiste(trip: Trip): RegisterTripDto {
		let registerTripDto: RegisterTripDto = {
			PathId: trip.PathId,
			LineId: trip.LineId,
			StartingTime: trip.StartingTime,
		};

		if (trip.EndTime != undefined && trip.Frequency != undefined) {
			registerTripDto.EndTime = trip.EndTime,
				registerTripDto.Frequency = trip.Frequency
		}

		return registerTripDto;
	}

	private transformStringHourMinToSeconds(hour: string) {
		try {
			let hourAndMin: string[] = hour.split(":");
			var sum: number = +hourAndMin[0] * 3600 + (+hourAndMin[1] * 60);
			return sum;
		} catch (e) {
			return undefined;
		}
	}
}