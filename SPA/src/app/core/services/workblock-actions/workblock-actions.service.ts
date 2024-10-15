import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WorkBlockGeneratorViewDto } from 'src/app/shared/dtos/WorkBlock/WorkBlockGeneratorViewDto';
import { ObtainWorkBlocksByIdDto } from 'src/app/shared/models/WorkBlock/Dto/ObtainWorkBlocksByIdDto';
import { WorkBlockGenerator } from 'src/app/shared/models/WorkBlock/WorkBlockGenerator/WorkBlockGenerator';
import { environment } from 'src/environments/environment';
import { WorkBlockGeneratorMapperService } from './mappers/WorkBlockGeneratorMapperService';

@Injectable({
	providedIn: 'root'
})
export class WorkblockActionsService {
	MDVURL = environment.MDVURL;

	constructor(private http: HttpClient, private mapper: WorkBlockGeneratorMapperService) {}

	registerWorkBlocksOfVehicleService(viewDto: WorkBlockGeneratorViewDto): Observable<any> {
		let modelDto = this.mapper.FromViewToDomainDto(viewDto);
		let workblockGen = WorkBlockGenerator.create(modelDto);

		const headers = { 'content-type': 'application/json' };

		let mdvDto = this.mapper.FromDomainToMDVDto(workblockGen);
		const body = JSON.stringify(mdvDto);

		return this.http.post<any>(this.MDVURL + '/mdvapi/WorkBlocks', body, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
	}

	/**
   * Obtains the workblocks of a given vehicle duty
   * 
   * @param veicDuty vehicle duty id
   * 
   */
	obtainWorkBlocksOfVehicleDuty(veicDuty: string): Observable<any> {
		const headers = { 'content-type': 'application/json' };

		return this.http
			.get<any>(this.MDVURL + '/mdvapi/WorkBlocks/VehicleDuty/' + veicDuty, { headers: headers })
			.pipe(
				catchError((err) => {
					throw err;
				})
			);
	}

	obtainWorkBlocksById(ids: any): Observable<any> {
		const headers = { 'content-type': 'application/json' };
		const body = JSON.stringify(ids);

		console.log('service xxx');
		console.log(body);

		return this.http.post<any>(this.MDVURL + '/mdvapi/WorkBlocksByIds', body, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
	}

	/**
   * Obtains the workblocks of a given vehicle duty
   * 
   * @param veicDuty vehicle duty id
   * 
   */
	obtainWorkBlocksOfDriverDuty(drivDuty: string): Observable<any> {
		const headers = { 'content-type': 'application/json' };

		return this.http.get<any>(this.MDVURL + '/mdvapi/WorkBlocks/DriverDuty/' + drivDuty, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
	}
}
