const mongoose = require('mongoose');
import { Service, Inject } from 'typedi';
import { DriverType } from '../../../DriverType/domain/DriverType';
import { DriverTypeRepositoryInterface } from '../../../DriverType/repository/IDriverType_Repository';
const BaseRepository = require('../Base_Repository/Base_Repository');

@Service('DriverType.repository')
export class DriverType_Repository extends BaseRepository implements DriverTypeRepositoryInterface  {
	private model: any;

	constructor(@Inject('DriverType_Schema') private DriverTypeSchema) {
		super(DriverTypeSchema);
		this.model = DriverTypeSchema;

		
	}

	async create(item:any): Promise<any> {
		
		return super.create(item);
	}

	async findByIdentity(key): Promise<any> {
		return super.findByIdentity(DriverType.obtainIdField(), key);
	}

	async findListObjects(searchTarget: string, array: any[]): Promise<any> {
		return super.findListObjects(searchTarget,array);
	}

	async exists(query: any) {
		return super.exists(query);
	}

	async find(){
		return this.model.find();
	}
}