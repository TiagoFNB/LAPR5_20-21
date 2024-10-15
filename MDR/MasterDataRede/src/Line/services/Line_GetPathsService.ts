import { Service, Inject } from 'typedi';
import { ILine_Repository } from '../repository/ILine_Repository';
import { IPath_Repository } from '../../Path/repository/IPath_Repository';
import { IDTO_Line_Code } from '../interfaces/IDTO_Line_Code';
import { ILine_GetPathsService } from './ILine_GetPathsService';
import { Line_DtoMapper } from '../mappers/Line_DtoMapper';

@Service('line.getPathsService')
export class Line_GetPathsService implements ILine_GetPathsService {
	constructor(@Inject('Line_Repo') private lineRepo: ILine_Repository,
	 @Inject('Path_Repo') private pathRepo: IPath_Repository){ }

	/**
	 * Validates the line code and obtains it's associated paths
	 * 
	 * In case an error occurs it is held inside the promise
	 * 
	 * @param lineDTO Line Code DTO
	 * 
	 */
	public async getPathsService(lineDTO: IDTO_Line_Code): Promise<any> {
        let dto: any;

		//Make database verifications
		await this.verifyDatabaseElements(lineDTO);

        //Obtain all paths associated to line
        await this.pathRepo.findPathsOfLine(lineDTO.key)
			.then(l => {
				//Map to dto
				dto = Line_DtoMapper.map2Dto_Line_Paths(lineDTO.key, l);
			})
			.catch((err) => {
				//Error ocurred, return it
				return Promise.reject(err);
		});


        //Return paths dto
		return Promise.resolve(dto);
	}


    /**
     * Verifies if line exists in the db
     * 
     * @param lineDTO line id
     */
	private async verifyDatabaseElements(lineDTO : IDTO_Line_Code) : Promise<any>{
		//Check if line with received id exists
        await this.lineRepo.exists({key:lineDTO.key})
        .then((exist) => {
            if(!exist){
				return Promise.reject(this.noLineError(lineDTO.key));
			}
        })

		return Promise.resolve(true);
    }
    
    /**
	 * Creates an error for the line that does not exist
	 * 
	 * @param lineId 
	 */
	private noLineError(lineId:string) : Error{
		let err = new Error();
		err.name = "NoMatchingLine";
		err.message ="Line with id: " + lineId + " does not exist.";
		return err;
	}

}
