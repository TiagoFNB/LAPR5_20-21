import { Injectable } from '@angular/core';
import { DriverDutyListingDTO } from 'src/app/shared/dtos/DriverDuty/DriverDutyListingDTO';

@Injectable({
  providedIn: 'root'
})
export class DriverDutyMapperService {

  constructor() { }

  public FromMDVListToViewList(obj: any[]): DriverDutyListingDTO[] {
    let dtoList: DriverDutyListingDTO[] = obj.map((x) => {
      let dto: DriverDutyListingDTO;

      dto = {
        driverDutyCode: x.driverDutyCode,
      };
      if (x.driverMecNumber) {
        dto.driverId = x.driverMecNumber;
      } else {
        dto.driverId = 'Driver not assigned yet';
      }

      return dto;
    });

    return dtoList;
  }

  public MapWorkblocksOfDriverDutyListing(driverDuty: DriverDutyListingDTO,data: any): DriverDutyListingDTO {
    driverDuty.workblocks = data;
    driverDuty.workblocks = driverDuty.workblocks.sort((a, b) =>
      a.startTime > b.startTime ? 1 : -1
    );

    if (driverDuty.workblocks.length != 0) {
      driverDuty.date = driverDuty.workblocks[0].date;
    } else {
      driverDuty.date = 'No date defined yet';
    }

    return driverDuty;
  }
}
