import { Inject } from 'typedi';
import { Request, Response } from 'express';
import { IDTO_Line } from '../interfaces/IDTO_Line';
import {ILine_CreateService } from '../services/ILine_CreateService';

export class Line_Controller {
	constructor(@Inject('line.CreateService') private lineServiceInstance: ILine_CreateService) {
	}

	/**
	 * Controller responsible for registering a new line
	 * 
	 * @param req 
	 * @param res 
	 */
	public async registerLine(req: Request, res: Response) : Promise<any> {
				await this.lineServiceInstance.registerLine(req.body as IDTO_Line)
					//Line creation was successfull
					.then((lineDto) => {
						return res.status(201).send(lineDto);
					})
					//Error ocurred during line creation
					.catch((err) => {
						console.log("Request failed.");
						//If error comes from the database
						if(err.driver){
							
							return res.status(422).send(err.message);
						}
						//Local Validation failed
						else{
							return res.status(400).send(err.message);
						}	
					});
	}
}
