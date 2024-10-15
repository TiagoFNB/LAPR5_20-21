import { Service, Inject, Container } from 'typedi';
import { VehicleType } from '../../../VehicleType/domain/VehicleType';
const BaseRepository = require('../Base_Repository/Base_Repository');

import { VehicleTypeRepositoryInterface } from '../../../VehicleType/repository/IVehicleType_Repository';
@Service('vehicleType.repository')
export class VehicleType_Repository extends BaseRepository implements VehicleTypeRepositoryInterface {
	private model: any;

	constructor(@Inject('vehicleType_Schema') private vehicleType_DataSchema) {
		super(vehicleType_DataSchema);

		this.model = vehicleType_DataSchema;
	}

	async create(item: any): Promise<any> {
		return super.create(item);
	}
	update(id, item) {
		throw new Error('Method not implemented.');
	}
	delete(id) {
		throw new Error('Method not implemented.');
	}
	findByObject(item) {
		return this.model.findByObject(item);
	}

	async findByIdentity(key) {
		
		return super.findByIdentity(VehicleType.obtainIdField(), key);
	}

	async findListObjects(searchTarget: string, array: any[]): Promise<any> {
		return super.findListObjects(searchTarget, array);
	}

	/**
     * Finds if an item corresponding to the query exists in the database
     * 
     * Always returns the promise, any errors will be inside it
     * 
     * @param query 
     */
	async exists(query: any) {
		return this.model.exists(query);
	}

	async find(){
		return this.model.find();
	}
}
