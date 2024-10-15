import { Injectable } from '@angular/core';
import { PathViewDTO } from 'src/app/shared/dtos/Path/PathViewDTO';

@Injectable({
  providedIn: 'root'
})
export class PathMapperService {

  constructor() { }

  public FromMDVListToViewList(obj: any[]) : PathViewDTO[]{
        let dtoList : PathViewDTO[] = obj.map(x => {
            let dto : PathViewDTO;

            dto = {
                key: x.key,
	            line: x.line,
                type: x.type,
                pathSegments: x.pathSegments
            };

            return dto;
        }) 
    
        return dtoList;
    }

}