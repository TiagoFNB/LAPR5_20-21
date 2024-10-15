const mongoose = require('mongoose');
import { Service, Inject } from 'typedi';
import { ILine_Repository } from '../../../Line/repository/ILine_Repository';
const BaseRepository = require('../Base_Repository/Base_Repository');

@Service('Line_Repo')
export class Line_Repository extends BaseRepository implements ILine_Repository {
	private model: any;

	constructor(@Inject('Line_Schema') private lineSchema) {
		super(lineSchema);
		this.model = lineSchema;
	}

	async create(item): Promise<any> {
		return super.create(item);
	}

	async findByIdentity(identityField: string, key: string): Promise<any> {
		return super.findByIdentity(identityField, key);
	}

	findListObjects(searchTarget: string, array: any[]): Promise<any> {
		return super.findListObjects(searchTarget, array);
	}

	async exists(query: any) {
		return super.exists(query);
	}

	/**
	 * List Of Lines that are filtered by the string received, and sorted
	 * 
	 * @param filter 	expression
	 * @param typefilter type (key or name)
	 * @param sort type (key or name)
	 */
	async findListOfLines(filter: string, typefilter: string, sort: string) {
		if(typefilter== undefined){
			return this.model.find().sort({ [sort]: 1 })
		}else if(sort ==undefined){
			return this.model.find({ [typefilter]: new RegExp("^"+filter)});
		}
		return this.model.find({ [typefilter]: new RegExp("^"+filter)}).sort({ [sort]: 1 });
	}
}
