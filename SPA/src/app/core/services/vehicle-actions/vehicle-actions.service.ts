import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { VehicleSPAtoMDVDTO } from 'src/app/shared/dtos/Vehicle/VehicleSPAtoMDVDTO';
import { VehicleViewDTO } from 'src/app/shared/dtos/Vehicle/VehicleViewDto';
import { Vehicle } from 'src/app/shared/models/Vehicle/Vehicle';
import { environment } from 'src/environments/environment';
import { VehicleMapperService } from './mappers/VehicleMapper.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleActionsService {

  

  MDVURL = environment.MDVURL;
  constructor(private http: HttpClient,private mapper:  VehicleMapperService) {}

  registerVehicle(vehicleProto: VehicleViewDTO) {
    let vDto=this.mapper.FromViewToModelDto(vehicleProto);
    let vehicle = Vehicle.create(vDto);

    const headers = { 'content-type': 'application/json' };
    
    let vehicleDto = this.mapper.FromModelToVehicleMDVDto(vehicle);
    const body = JSON.stringify(vehicleDto);
    
		return this.http.post<VehicleSPAtoMDVDTO>(this.MDVURL + '/mdvapi/Vehicle', body, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
  }

  getVehicles() {
    const headers = { 'content-type': 'application/json' };
		return this.http.get<VehicleSPAtoMDVDTO[]>(this.MDVURL + '/mdvapi/Vehicle', { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
  }
}
