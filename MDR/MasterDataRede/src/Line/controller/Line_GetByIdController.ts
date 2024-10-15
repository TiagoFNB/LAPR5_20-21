import { Inject } from 'typedi';
import { Request, Response } from 'express';
import { Line_DtoMapper } from '../mappers/Line_DtoMapper';
import { ILine_GetByIdService } from '../services/ILine_GetByIdService';
const url = require('url');

export class Line_GetByIdController {
	constructor(@Inject('line.getByIdService') private lineServiceInstance: ILine_GetByIdService) {
	}

	public async getLineById(req: Request, res: Response) : Promise<any> {	
		await this.lineServiceInstance.getLineByIdService(Line_DtoMapper.map2DTO_Line_Code(req.params.key))
					//Obtaining line was successful
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
