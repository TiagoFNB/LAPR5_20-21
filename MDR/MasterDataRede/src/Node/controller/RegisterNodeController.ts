import { Container, Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { RegisterNodeServiceInterface } from '../services/INodeRegisterService';
import { IDTO_Node } from '../DTO/IDTO_Node';
import { celebrate, Joi } from 'celebrate';

export default class RegisterNodeController {
	constructor(@Inject('node.Registerservice') private nodeRegisterServiceInstance: RegisterNodeServiceInterface) {}

	public async registerNode(req: Request, res: Response): Promise<any> {
		const node_data = req.body;

		await this.nodeRegisterServiceInstance
			.registerNode(node_data as IDTO_Node)
			.then((node) => {
				return res.status(201).send(node); // DTO
			})
			.catch((err) => {
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
