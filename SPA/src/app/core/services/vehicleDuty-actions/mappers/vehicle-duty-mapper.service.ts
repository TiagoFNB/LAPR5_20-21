import { VehicleDutyListingDTO } from './../../../../shared/dtos/VehicleDuty/VehicleDutyListingDTO';
import { Injectable } from '@angular/core';

import { VehicleDutySPAtoMDVDTO } from 'src/app/shared/dtos/VehicleDuty/VehicleDutySPAtoMDVDTO';
import { VehicleDutyViewDTO } from 'src/app/shared/dtos/VehicleDuty/VehicleDutyViewDTO';

import { VehicleDuty } from 'src/app/shared/models/VehicleDuty/VehicleDuty';

@Injectable({
  providedIn: 'root',
})
export class VehicleDutyMapperService {
  constructor() { }

  public FromModelToVehicleDutyMDVDto(
    vehicleDuty: VehicleDuty
  ): VehicleDutySPAtoMDVDTO {
    let vehicleDutyDto: VehicleDutySPAtoMDVDTO = {
      VehicleDutyCode: vehicleDuty.VehicleDutyCode,
      VehicleLicense: vehicleDuty.VehicleLicense,
    };
    return vehicleDutyDto;
  }

  public FromMDVListToViewList(obj: any[]): VehicleDutyListingDTO[] {
    let dtoList: VehicleDutyListingDTO[] = obj.map((x) => {
      let dto: VehicleDutyListingDTO;

      dto = {
        vehicleDutyCode: x.vehicleDutyCode,
      };
      if (x.vehicleLicense) {
        dto.vehicleLicense = x.vehicleLicense;
      } else {
        dto.vehicleLicense = 'Vehicle not assigned yet';
      }

      return dto;
    });

    return dtoList;
  }

  public MapWorkblocksOfVehicleDutyListing(vehicleDuty: VehicleDutyListingDTO,data: any): VehicleDutyListingDTO {
    vehicleDuty.workblocks = data;
    vehicleDuty.workblocks = vehicleDuty.workblocks.sort((a, b) =>
      a.startTime > b.startTime ? 1 : -1
    );

    if (vehicleDuty.workblocks.length != 0) {
      vehicleDuty.date = vehicleDuty.workblocks[0].date;
    } else {
      vehicleDuty.date = 'No date defined yet';
    }

    return vehicleDuty;
  }
}
