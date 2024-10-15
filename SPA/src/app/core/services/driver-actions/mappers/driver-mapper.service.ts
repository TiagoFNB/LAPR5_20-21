import { Injectable } from '@angular/core';
import { DriverSPAtoMDVDTO } from 'src/app/shared/dtos/Driver/DriverSPAtoMDVDTO';
import { DriverViewDTO } from 'src/app/shared/dtos/Driver/DriverViewDto';
import { DriverViewtoModelDTO } from 'src/app/shared/dtos/Driver/DriverViewToModelDTO';
import { Driver } from 'src/app/shared/models/Driver/Driver';

@Injectable({
  providedIn: 'root'
})
export class DriverMapperService {

  constructor() { }

  public FromModelToDriverMDVDto(driver: Driver): DriverSPAtoMDVDTO {
		let driverDto: DriverSPAtoMDVDTO = {
            name:driver.name,
            mechanographicNumber:driver.mechanographicNumber,
            birthDate:driver.birthDate,
            citizenCardNumber:driver.citizenCardNumber,
            fiscalNumber:driver.fiscalNumber,
            entryDate:driver.entryDate, 
            type:driver.type,
            license:driver.license,
            licenseDate:driver.licenseDate
    };
    if(driver.departureDate){
                driverDto.departureDate=driver.departureDate;
    }
		return driverDto;
	}

	public FromViewToModelDto(driver: DriverViewDTO): DriverViewtoModelDTO {
		let driverDto:  DriverViewtoModelDTO = {
      name:driver.name,
      mechanographicNumber:driver.mechanographicNumber,
      birthDate:undefined,
      citizenCardNumber:driver.citizenCardNumber,
      fiscalNumber:driver.fiscalNumber,
      entryDate:undefined,
      type:driver.type,
      license:driver.license,
      licenseDate:undefined
            
    };
    if(driver.birthDate){
      driverDto.birthDate=driver.birthDate.getMonth()+1+'/'+driver.birthDate.getDate()+'/'+ driver.birthDate.getFullYear();
  }
    if(driver.entryDate){
      driverDto.entryDate=driver.entryDate.getMonth()+1+'/'+driver.entryDate.getDate()+'/'+ driver.entryDate.getFullYear() ;
  }
    if(driver.licenseDate){
      driverDto.licenseDate=driver.licenseDate.getMonth()+1+'/'+driver.licenseDate.getDate()+'/'+ driver.licenseDate.getFullYear();
  }
    if(driver.departureDate){
      driverDto.departureDate=driver.departureDate.getMonth()+1+'/'+driver.departureDate.getDate()+'/'+ driver.departureDate.getFullYear();
  }
		return driverDto;
	}
}
