import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { DriverType } from 'src/app/shared/models/DriverType/DriverType';
import { DriverTypeInterface } from 'src/app/shared/models/DriverType/DriverTypeInterface';
import { environment } from '../../../../environments/environment';
@Injectable({
	providedIn: 'root'
})
export class DriverTypeActionsService {
	MDRURL = environment.MDRURL;

	private driverType: DriverType;

	constructor(private http: HttpClient) {}

	//Change this to access the db instead
	getDriverTypes() {
		const headers = { 'content-type': 'application/json' };
		//Communicated with the db to register a line
		return this.http.get<DriverType[]>(this.MDRURL + '/api/drivertype', { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
	}

	registerDriverType(drivertypeProto: DriverTypeInterface): Observable<DriverType> {
		this.driverType = DriverType.create(drivertypeProto);
		const headers = { 'content-type': 'application/json' };
		const body = JSON.stringify(this.driverType);
		return this.http.post<DriverType>(this.MDRURL + '/api/drivertype', body, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
	}

	// NEED DRIVER CLASS OR DRIVER DTO
}
