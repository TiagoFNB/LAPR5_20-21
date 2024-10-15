import { Injectable } from "@angular/core";
import { min } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class ObtainTripsMapperService {

    public mapFromMDVToView(list : any[]){
        let hour = 3600;
        let minute = 60;

        return list.map(x=> {

            let hourX = Math.floor(x.passingTimes[0]/hour).toString();
            if(hourX.length==1){
                hourX = "0" + hourX;
            }

            let minX = (Math.round((x.passingTimes[0]%hour)/minute)).toString();
            if(minX.length==1){
                minX = "0"+ minX;
            }

            let departure = hourX + ":" + minX + "h";

            return {
                Id : x.key,
                path: x.pathId,
                departure: departure
            }
        });
    }
}