import { Injectable } from "@angular/core";
import { WorkBlockDomainToMDVDTO } from "src/app/shared/dtos/WorkBlock/WorkBlockDomainToMDVDTO";
import { WorkBlockGeneratorViewDto } from "src/app/shared/dtos/WorkBlock/WorkBlockGeneratorViewDto";
import { WorkBlockGenerator } from "src/app/shared/models/WorkBlock/WorkBlockGenerator/WorkBlockGenerator";
import { WorkBlockGeneratorInterface } from "src/app/shared/models/WorkBlock/WorkBlockGenerator/WorkBlockGeneratorInterface";

@Injectable({ providedIn: 'root' })
export class WorkBlockGeneratorMapperService {
    public constructor() {}

    public FromViewToDomainDto(dto : WorkBlockGeneratorViewDto) : WorkBlockGeneratorInterface{
        let formattedTime : string = dto.time.replace(/T/," ");
        formattedTime = formattedTime.replace(/-/g,"/");
        
        //Calculate how many seconds the duration is
        let durationInSeconds : number = 0;

        let temp = dto.durationBlocks.split(':');
        durationInSeconds = durationInSeconds + parseInt(temp[0])*3600 + parseInt(temp[1])*60;

        let tripsIds = dto.selectedTrips.map(x => x.Id)

        let resDto : WorkBlockGeneratorInterface = {
            maxBlocks : dto.amountBlocks,
            maxDuration : durationInSeconds,
            dateTime : formattedTime,
            vehicleDuty : dto.vehicleServiceId,
            trips : tripsIds
        };

        return resDto;
    }

    public FromDomainToMDVDto(obj : WorkBlockGenerator) : WorkBlockDomainToMDVDTO{
        let resDto : WorkBlockDomainToMDVDTO = {
            maxBlocks : obj.maxBlocks,
            maxDuration : obj.maxDuration,
            dateTime : obj.dateTime,
            vehicleDuty : obj.vehicleDuty,
            trips : obj.trips
        }

        return resDto;
    }
}