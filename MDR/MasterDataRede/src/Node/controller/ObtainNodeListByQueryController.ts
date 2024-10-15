import { Container, Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { IObtainNodeService } from '../services/IObtainNodeService';

const url = require('url');

export default class ObtainNodeListByQueryController {
	constructor(@Inject('node.ObtainNodeService') private ObtainNodeServiceInstance: IObtainNodeService) {}

	public async listNodesByShortNameOrName(req: Request, res: Response): Promise<any> {
		const queryObject = url.parse(req.url, true).query;

		await this.ObtainNodeServiceInstance
			.listNodesByShortNameOrName(queryObject)
			.then((nodeList) => {
				return res.status(200).send(nodeList); // DTO
			})
			.catch((err) => {
				if (err.driver) {
					// if the error is returned from mongodb it will have a driver field so i define a new error status for it

					return res.status(422).send(err.message);
				} else {
					// else it must be from local validation

					return res.status(400).send(err.message);
				}
			});
	}
}
