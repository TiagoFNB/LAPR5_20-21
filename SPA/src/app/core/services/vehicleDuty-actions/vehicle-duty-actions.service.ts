import { VehicleDutyMapperService } from './mappers/vehicle-duty-mapper.service';
import { VehicleDutySPAtoMDVDTO } from './../../../shared/dtos/VehicleDuty/VehicleDutySPAtoMDVDTO';
import { VehicleDutyViewDTO } from 'src/app/shared/dtos/VehicleDuty/VehicleDutyViewDTO';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { VehicleDuty } from 'src/app/shared/models/VehicleDuty/VehicleDuty';
import { Observable } from 'rxjs/internal/Observable';
import { VehicleDutyListingDTO } from 'src/app/shared/dtos/VehicleDuty/VehicleDutyListingDTO';

@Injectable({
  providedIn: 'root'
})
export class VehicleDutyActionsService {
  MDVURL = environment.MDVURL;
  constructor(private http: HttpClient,private mapper:VehicleDutyMapperService) {}

  registerVehicleDuty(vehicleDutyProto: VehicleDutyViewDTO) {
    let vehicleDuty =    VehicleDuty.create(vehicleDutyProto);

    const headers = { 'content-type': 'application/json' };
    
    let vehicleDutyDtoGo  = this.mapper.FromModelToVehicleDutyMDVDto(vehicleDuty);
    const body = JSON.stringify(vehicleDutyDtoGo);
    
		return this.http.post<VehicleDutySPAtoMDVDTO>(this.MDVURL + '/mdvapi/VehicleDuty', body, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
  }

  getAllVehicleDuties(){    
    const headers = { 'content-type': 'application/json' };
    
		return this.http.get<VehicleDutyListingDTO[]>(this.MDVURL + '/mdvapi/VehicleDuty', { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
  }
  
}
