const mongoose = require('mongoose');
const { isVariableDeclaration } = require('typescript');
import { Service, Inject, Container } from 'typedi';
import { Node } from '../../../Node/domain/Node';

//const  NodeModel = require('../../../Node/data_schema/Node_Schema');
const BaseRepository = require('../Base_Repository/Base_Repository');

import { NodeRepositoryInterface } from '../../../Node/repository/INode_Repository';
@Service('node.repository')
export class Node_Repository extends BaseRepository implements NodeRepositoryInterface {
	//     implements NodeRepositoryInterface   {   //  extends BaseRepo2 implements NodeRepositoryInterface   {
	private model: any;

	constructor(@Inject('Node_DataSchema') private node_DataSchema) {
		super(node_DataSchema);
		this.model = node_DataSchema;
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
		return super.findOne(Node.obtainIdField(), key);
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
		return super.exists(query);
	}

	async findWithfilter_AndOr_Sort(filterBy: string, filterType: string, sortBy: string) {
		if (filterBy && filterType) {
			const result = this.model.find({ [filterBy]: new RegExp('^' + filterType) }).sort({ [sortBy]: 1 });
			return result;
		} else {
			const result = this.model.find().sort({ [sortBy]: 1 }); //.sort({ [sortBy]: 1 });
			return result;
		}
	}
}
