import { Inject, Service } from "typedi";
import { IPath_GetListService } from "../interfaces/IPath_GetListService";
import { Path_DtoMapper } from "../mappers/Path_DtoMapper";
import { IPath_Repository } from "../repository/IPath_Repository";



@Service('path.getListService')
export class Path_GetListService implements IPath_GetListService  {
constructor(@Inject('Path_Repo') private pathRepo: IPath_Repository) {

    }

	async obtainPaths(): Promise<any> {
        let pathDTOList;
        //Obtain all paths
        await this.pathRepo.find()
        .then((pathList) => {
            pathList.map(function(element){
                let path = Path_DtoMapper.mapPersistence2Presentation(element.key,element.type,element.pathSegments,element.isEmpty)

                
                return path;
            })
            pathDTOList =pathList;
        });

        
        //Return result
        return Promise.resolve(pathDTOList);

    }
    
    /**
     * Get specific Path
     */
    async getPath(keyToCheck : string): Promise<any> {
        //Obtain path by key
        let result;
        await this.pathRepo.findByIdentity("key",keyToCheck)
        .then((path) => {
            let Dto = Path_DtoMapper.mapPersistence2PresentationDTO(path.key,path.line,path.type,path.pathSegments);
            result = Dto;
        })
        .catch((err) => {
            result = undefined;
            throw err;
        });

        if(result == undefined){
            return Promise.reject(new Error("Path was not found"));
        }
        return Promise.resolve(result);
	}
}