import { Inject } from 'typedi';
import { Request, Response } from 'express';
import { IPath_GetListService } from '..//interfaces/IPath_GetListService';
const url = require('url');


export class Path_GetListController {
	constructor(@Inject('path.getListService') private pathServiceInstance: IPath_GetListService) {
	}

	/**
	 * Controller responsible for obtaining list of paths
	 * 
	 * @param req 
	 * @param res 
	 */
	public async getList(req: Request, res: Response): Promise<any> {

		await this.pathServiceInstance.obtainPaths()
			//Obtaining line lines was successful
			.then((listPaths) => {
				return res.status(200).send(listPaths);
			})
			//Error ocurred
			.catch((err) => {
				console.log("Request failed.");
				//If error comes from the database
				if (err.driver) {
					return res.status(422).send(err.message);
				}
				//Local validation failed
				else {
					return res.status(400).send(err.message);
				}
			});
	}

	public async getPath(req: Request, res: Response): Promise<any> {

		await this.pathServiceInstance.getPath(req.params.key)
			//Obtaining line lines was successful
			.then((path) => {
				return res.status(200).send(path);
			})
			//Error ocurred
			.catch((err) => {
				console.log("Request failed.");
				//If error comes from the database
				if (err.driver) {
					return res.status(422).send(err.message);
				}
				//Local validation failed
				else {
					return res.status(404).send(err.message);
				}
			});
	}
}