import { Injectable } from '@angular/core';
import { LineViewDTO } from 'src/app/shared/dtos/Line/LineViewDTO';

@Injectable({
  providedIn: 'root'
})
export class LineMapperService {

  constructor() { }

  public FromMDVListToViewList(obj: any[]) : LineViewDTO[]{
        let dtoList : LineViewDTO[] = obj.map(x => {
            let dto : LineViewDTO;

            let hexColor = this.rgbToHex(x.RGB.red,x.RGB.green,x.RGB.blue);

            let allowedDrivs = x.AllowedDrivers.toString();
            let allowedVeics = x.AllowedVehicles.toString();

            dto = {
                code: x.key,
	            name: x.name,
	            node1: x.terminalNode1,
	            node2:  x.terminalNode2,
	            color: hexColor,
	            allowedDrivers : allowedDrivs,
	            allowedVehicles: allowedVeics
            };

            return dto;
        }) 
    
        return dtoList;
    }

    //Converts rgb to hex format
    private rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

}