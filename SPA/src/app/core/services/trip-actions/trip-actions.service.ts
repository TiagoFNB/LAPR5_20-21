import { Injectable } from '@angular/core';
import { PathInterface } from 'src/app/shared/models/path/PathInterface';
import { Path } from 'src/app/shared/models/path/Path';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { RegisterTripMapperService } from './mappers/registerTripMapper';
import { RegisterTripDto } from 'src/app/shared/models/Trip/Dto/RegisterTripDto';
import { Trip } from 'src/app/shared/models/Trip/Trip';
import { TripInterface } from 'src/app/shared/models/Trip/TripInterface';
import { exception } from 'console';
import { TripMDVToSPADTO } from 'src/app/shared/dtos/Trip/TripMDVToSPADTO';
@Injectable({
	providedIn: 'root'
})
export class TripActionsService {
	MDVURL = environment.MDVURL;

    constructor(
        private http: HttpClient, 
        private mapper: RegisterTripMapperService) {}

	registerTrip(tripPrototype: any): Observable<TripInterface[]> {
		
		let dto: RegisterTripDto = this.mapper.FromModelToDto(tripPrototype);
		let trip: Trip = Trip.Create(dto);
		let Dto2Persiste : RegisterTripDto = this.mapper.FromDtoToPersiste(trip);
		const headers = { 'content-type': 'application/json' };
		const body = JSON.stringify(Dto2Persiste);
		return this.http.post<TripInterface[]>(this.MDVURL + '/mdvapi/trip', body, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
	}

	/**
	 * Obtains the trips of a given line
	 * @param line 
	 */
	obtainTripsOfLine(line : string) : Observable<TripMDVToSPADTO[]>{
		if(line){
			const headers = { 'content-type': 'application/json' };
			return this.http
				.get<TripMDVToSPADTO[]>(this.MDVURL + `/mdvapi/trip/line/${line}`, {
					headers: headers
				})
				.pipe(
					catchError((err) => {
						throw err;
					})
				);
		}
	}

}
