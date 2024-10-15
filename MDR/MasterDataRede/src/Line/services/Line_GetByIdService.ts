import { Service, Inject } from 'typedi';
import { ILine_Repository } from '../repository/ILine_Repository';
import { IDTO_Line_Code } from '../interfaces/IDTO_Line_Code';
import { Line_DtoMapper } from '../mappers/Line_DtoMapper';
import { ILine_GetByIdService } from './ILine_GetByIdService';

@Service('line.getByIdService')
export class Line_GetByIdService implements ILine_GetByIdService {
	constructor(@Inject('Line_Repo') private lineRepo: ILine_Repository){ }

	/**
	 * Validates the line code and obtains it's associated paths
	 * 
	 * In case an error occurs it is held inside the promise
	 * 
	 * @param lineDTO Line Code DTO
	 * 
	 */
	public async getLineByIdService(lineDTO: IDTO_Line_Code): Promise<any> {
        let dto: any;

        //Obtain the line with received id
        await this.lineRepo.findByIdentity('key',lineDTO.key)
			.then(l => {
                if(!l){
                    throw new Error('Line with Id: ' + lineDTO.key + ' does not exist.');
                }

                let arr = [];
                arr.push(l);

				//Map to dto
				dto = Line_DtoMapper.map2Dto_List_Lines(arr);
			})
			.catch((err) => {
				//Error ocurred, return it
				return Promise.reject(err);
		});


        //Return dto
		return Promise.resolve(dto);
	}

}
