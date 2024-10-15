const mongoose = require('mongoose');
import { Service, Inject } from 'typedi';
import { IPath_Repository } from '../../../Path/repository/IPath_Repository';
const BaseRepository = require('../Base_Repository/Base_Repository');

@Service('Path_Repo')
export class Path_Repository extends BaseRepository implements IPath_Repository {
	private model: any;

	constructor(@Inject('Path_Schema') private PathSchema) {
		super(PathSchema);
		this.model = PathSchema;


	}

	async create(item: any): Promise<any> {
		return super.create(item);
	}

	async findByIdentity(identityField: string, key): Promise<any> {
		return super.findByIdentity(identityField, key);
	}

	findListObjects(searchTarget: string, array: any[]): Promise<any> {
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

	/**
	 * Find the paths of a line
	 * 
	 * @param lineId line id 
	 */
	async findPathsOfLine(lineId: any) {
		return this.model.find({ line: lineId });
	}

	async find(){
		return this.model.find();
	}
}
