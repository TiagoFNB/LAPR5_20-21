import { Inject } from 'typedi';
import { Request, Response } from 'express';
import {ILine_GetListService } from '../services/ILine_GetListService';
import { IDTO_List_Lines } from '../interfaces/IDTO_List_Lines';
const url = require('url');

export class Line_GetListController {
	constructor(@Inject('line.getListService') private lineServiceInstance: ILine_GetListService) {
	}

	/**
	 * Controller responsible for obtaining list of lines
	 * 
	 * @param req 
	 * @param res 
	 */
	public async getList(req: Request, res: Response) : Promise<any> {
		// let newReq = {
		// 	filter : req.params.filter,
		// 	typeFilter : req.params.typefilter,
		// 	sort : req.params.sort
		// }

		let queryObject = url.parse(req.url, true).query;


		
		await this.lineServiceInstance.getList(queryObject as IDTO_List_Lines)
					//Obtaining line lines was successful
					.then((listLines) => {
						return res.status(200).send(listLines);
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
