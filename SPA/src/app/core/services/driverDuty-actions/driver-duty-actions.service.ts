import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { DriverDutyViewDTO } from 'src/app/shared/dtos/DriverDuty/DriverDutyViewDTO';
import { DriverDutySPAtoMDVDTO } from 'src/app/shared/dtos/DriverDuty/DriverDutySPAtoMDVDTO';
import { DriverDuty } from 'src/app/shared/models/DriverDuty/DriverDuty';
import { environment } from 'src/environments/environment';
import { DriverDutyListingDTO } from 'src/app/shared/dtos/DriverDuty/DriverDutyListingDTO';

@Injectable({
  providedIn: 'root'
})
export class DriverDutyActionsService {
  MDVURL = environment.MDVURL;
  constructor(private http: HttpClient) {}

  registerDriverDuty(driverDutyProto: DriverDutyViewDTO) {
    let driverDuty = DriverDuty.create(driverDutyProto);

    const headers = { 'content-type': 'application/json' };
    
    let driverDutyDtoGo  = driverDuty as DriverDutySPAtoMDVDTO;
    const body = JSON.stringify(driverDutyDtoGo);
    
		return this.http.post<DriverDuty>(this.MDVURL + '/mdvapi/DriverDuty', body, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
  }


  getAllDriverDuties(){    
    const headers = { 'content-type': 'application/json' };
    
		return this.http.get<DriverDutyListingDTO[]>(this.MDVURL + '/mdvapi/DriverDuty', { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
  }

  
}
