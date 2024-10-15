import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { VehicleType } from 'src/app/shared/models/VehicleType/VehicleType';
import { VehicleTypeInterface } from 'src/app/shared/models/VehicleType/VehicleTypeInterface';
import { environment } from '../../../../environments/environment';
@Injectable({
	providedIn: 'root'
})
export class VehicleTypeActionsService {
	MDRURL = environment.MDRURL;

	constructor(private http: HttpClient) {}

	public getVehicleTypes() {
		const headers = { 'content-type': 'application/json' };
		//Communicated with the db to register a line
		return this.http.get<VehicleType[]>(this.MDRURL + '/api/vehicleType', { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
	}

	registerVehicleType(nodePrototype: VehicleTypeInterface): Observable<VehicleType> {
		let vehicleType: VehicleTypeInterface = VehicleType.create(nodePrototype);

		const headers = { 'content-type': 'application/json' };
		const body = JSON.stringify(vehicleType);

		return this.http.post<VehicleType>(this.MDRURL + '/api/vehicleType', body, { headers: headers }).pipe(
			catchError((err) => {

				throw err;
			})
		);
	}
}
