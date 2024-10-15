import { Service, Inject } from 'typedi';
import { ILine_Repository } from '../repository/ILine_Repository';
import { IPath_Repository } from '../../Path/repository/IPath_Repository';
import { IDTO_Line_Code } from '../interfaces/IDTO_Line_Code';
import { ILine_GetListService } from './ILine_GetListService';
import { Line_DtoMapper } from '../mappers/Line_DtoMapper';
import { IDTO_List_Lines } from '../interfaces/IDTO_List_Lines'
import { Types } from '../interfaces/IDTO_List_Lines'

@Service('line.getListService')
export class Line_GetListService implements ILine_GetListService {
	constructor(@Inject('Line_Repo') private lineRepo: ILine_Repository) { }

	/**
	 * await call of findListOfLines(filter, filtertype and the sort type)
	 * 
	 * In case an error occurs it is held inside the promise
	 * 
	 * @param lineLines request list lines
	 * 
	 */
	public async getList(listLines: IDTO_List_Lines): Promise<any> {


		//first check if typefilter is correct
		if (listLines.typeFilter === "key" || listLines.typeFilter === "name") { 

			//filter cant be undefined because type is correct
			if(listLines.filter == undefined){
				return Promise.reject(new Error("filter is missing"));
			}


			//if it passed the typefilter, now check  sortBy
			if (listLines.sortBy === "key" || listLines.sortBy === "name") { 

				//its correct move on

			//if sort isnt key or name it can only be undefined, ELSE its an error
			} else {
				if (listLines.sortBy != undefined) {
					return Promise.reject(new Error("sortBy type must be 'name' or 'key'"));
				}
			}


		} else { //if not verify if its something diferent than undefined or name key
			if (listLines.typeFilter != undefined){
				return Promise.reject(new Error("typeFilter must be 'name' or 'key'"));


			} else {
				//IF IT's undefined it cant have a filter !
				if(listLines.filter != undefined){
					return Promise.reject(new Error("Must define typeFilter to 'name' or 'key'"));
				}

			}

			//If filter isn't selected, sort must be atleast 
			if(listLines.sortBy == undefined) {
				return Promise.reject(new Error("Sort or filter is needed"));
			}
		}

		let dto;

		//Obtain all lines
		await this.lineRepo.findListOfLines(listLines.filter, listLines.typeFilter, listLines.sortBy)
			.then(l => {
				//Map to dto
				dto = Line_DtoMapper.map2Dto_List_Lines(l);
			})
			.catch((err) => {
				//Error ocurred, return it
				return Promise.reject(err);
			});


		//Return line dto
		return Promise.resolve(dto);
	}

}