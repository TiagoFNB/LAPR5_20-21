import { VehicleViewDTO } from 'src/app/shared/dtos/Vehicle/VehicleViewDto';
import { VehicleSPAtoMDVDTO } from '../../../../shared/dtos/Vehicle/VehicleSPAtoMDVDTO';
import { Injectable } from '@angular/core';
import { Vehicle } from 'src/app/shared/models/Vehicle/Vehicle';
import { VehicleViewToModelDTO } from 'src/app/shared/dtos/Vehicle/VehicleViewToModelDTO';

@Injectable({ providedIn: 'root' })
export class VehicleMapperService {
	public constructor() {}
	public FromModelToVehicleMDVDto(vehicle: Vehicle): VehicleSPAtoMDVDTO {
		let vehicleDto: VehicleSPAtoMDVDTO = {
            license: vehicle.license,
            vin: vehicle.vin,
            type:vehicle.type,
            date:vehicle.entryDateOfService
		};
		return vehicleDto;
	}

	public FromViewToModelDto(vehicle: VehicleViewDTO): VehicleViewToModelDTO {
		let vehicleDto:  VehicleViewToModelDTO = {
            license: vehicle.license,
            vin: vehicle.vin,
            type:vehicle.type,
            entryDateOfService:undefined
		};
		if(vehicle.entryDateOfService){
			vehicleDto.entryDateOfService=vehicle.entryDateOfService.getMonth()+1+'/'+vehicle.entryDateOfService.getDate()+'/'+ vehicle.entryDateOfService.getFullYear();
		}
		return vehicleDto;
	}
}
