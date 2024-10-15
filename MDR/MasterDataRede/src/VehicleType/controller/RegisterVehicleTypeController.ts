import { Container, Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { RegisterVehicleTypeServiceInterface } from '../services/IVehicleTypeRegisterService';
import { IDTO_VehicleType } from '../DTO/IDTO_VehicleType';

export default class RegisterVehicleTypeController {
	private service;

	constructor(
		@Inject('vehicleType.Registerservice')
		private vehicleTypeRegisterServiceInstance: RegisterVehicleTypeServiceInterface
	) {}

	public async registerVehicleType(req: Request, res: Response): Promise<any> {
		const vehicleType_data = req.body;

		await this.vehicleTypeRegisterServiceInstance
			.registerVehicleType(vehicleType_data as IDTO_VehicleType)
			.then((vehicleType) => {
				return res.status(201).send(vehicleType); // DTO
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
