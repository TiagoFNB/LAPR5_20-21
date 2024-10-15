import { Inject } from 'typedi';
import { Request, Response, nextFunction } from 'express';
// import { celebrate, Joi } from 'celebrate';
//import { Path_CreateService } from '../services/Path_CreateService';
import { IDTO_Path } from '../interfaces/IDTO_Path';
import {IPath_CreateService} from '../interfaces/IPath_CreateService';

const express = require('express');
const app = express();

export default class Path_Controller {
	constructor(@Inject('path.CreateService') private pathServiceInstance: IPath_CreateService) {}

	public async registerPath(req: Request, res: Response) {

		const path_data = req.body;
		await this.pathServiceInstance.registerPath(path_data as IDTO_Path)
			.then((path) => {
				console.log('Path was registed');
				return res.status(201).send(path); // DTO
			})
			.catch((err) => {
				console.log('Path was NOT registed!!!');
				if (err.driver) {
					// if the error is returned from mongodb it will have a driver field and its will probably be becouse of duplicate key
					
					return res.status(422).send(err.message);
				} else {
					// else it must be from local validation

					return res.status(400).send(err.message);
				}
			});
	}
}
