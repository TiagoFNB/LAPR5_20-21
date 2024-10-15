import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { DriverSPAtoMDVDTO } from 'src/app/shared/dtos/Driver/DriverSPAtoMDVDTO';
import { DriverViewDTO } from 'src/app/shared/dtos/Driver/DriverViewDto';
import { Driver } from 'src/app/shared/models/Driver/Driver';
import { environment } from 'src/environments/environment';
import { DriverMapperService } from './mappers/driver-mapper.service';

@Injectable({
	providedIn: 'root'
})
export class DriverActionsService {
	MDVURL = environment.MDVURL;
	constructor(private http: HttpClient, private mapper: DriverMapperService) {}

	registerDriver(driverProto: DriverViewDTO) {
		let vDto = this.mapper.FromViewToModelDto(driverProto);
		let driver = Driver.create(vDto);

		const headers = { 'content-type': 'application/json' };

		let driverDto = this.mapper.FromModelToDriverMDVDto(driver);
		const body = JSON.stringify(driverDto);

		return this.http.post<DriverSPAtoMDVDTO>(this.MDVURL + '/mdvapi/Driver', body, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
	}

	getDriverWithStartingId(id: string) {
		if (id) {
			const headers = { 'content-type': 'application/json' };

			return this.http
				.get<Driver[]>(this.MDVURL + `/mdvapi/Driver/${id}`, {
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
