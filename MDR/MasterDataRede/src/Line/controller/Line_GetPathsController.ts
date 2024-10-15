import { Inject } from 'typedi';
import { Request, Response } from 'express';
import {ILine_GetPathsService } from '../services/ILine_GetPathsService';
import { Line_DtoMapper } from '../mappers/Line_DtoMapper';

export class Line_GetPathsController {
	constructor(@Inject('line.getPathsService') private lineServiceInstance: ILine_GetPathsService) {
	}

	/**
	 * Controller responsible for obtaining line paths
	 * 
	 * @param req 
	 * @param res 
	 */
	public async getPaths(req: Request, res: Response) : Promise<any> {	
		await this.lineServiceInstance.getPathsService(Line_DtoMapper.map2DTO_Line_Code(req.params.key))
					//Obtaining line paths was successful
					.then((lineDto) => {
						return res.status(200).send(lineDto);
					})
					//Error ocurred
					.catch((err) => {
						console.log("Request failed.");
						//If error comes from the database
						if(err.driver){
							return res.status(422).send(err.message);
						}
						//Local validation failed
						else{
							return res.status(400).send(err.message);
						}	
					});
    }
}
