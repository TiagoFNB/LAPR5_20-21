import { Service, Inject } from 'typedi';

//const Node = require('../domain/Node');
import { VehicleType } from '../domain/VehicleType';
import { RegisterVehicleTypeServiceInterface } from './IVehicleTypeRegisterService';
import { VehicleTypeRepositoryInterface } from '../repository/IVehicleType_Repository';

import { VehicleType_Mapper } from '../mappers/VehicleTypeMap';

@Service('vehicleType.Registerservice')
export default class RegisterVehicleTypeService implements RegisterVehicleTypeServiceInterface {
	constructor(@Inject('vehicleType.repository') private vehicleTypeRepo: VehicleTypeRepositoryInterface) {}

	async registerVehicleType(object): Promise<any> {
		let createdVehicleType;
		let savedVehicleType;

		const dto2domain = VehicleType_Mapper.mapDTO2Domain(object);

		await VehicleType.create(dto2domain)
			.then(async (vehicleType) => {
				createdVehicleType = vehicleType;
			})
			.catch(async (err) => {
				return new Promise(function(resolve, reject) {
					return reject(err);
				});
			});

		const dto2persistence = VehicleType_Mapper.mapDomain2Persistence(createdVehicleType);

		await this.vehicleTypeRepo
			.create(dto2persistence)
			.then((vehicleType) => {
				savedVehicleType = vehicleType;
			})
			.catch((err) => {
				return new Promise(function(resolve, reject) {
					return reject(err);
				});
			});

		return new Promise(function(resolve, reject) {
			const dto = VehicleType_Mapper.map2DTO(createdVehicleType);

			return resolve(dto);
		});
	}
}
