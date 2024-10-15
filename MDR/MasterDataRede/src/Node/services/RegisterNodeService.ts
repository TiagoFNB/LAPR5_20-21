import { Service, Container, Inject } from 'typedi';

//const Node = require('../domain/Node');
import { Node } from '../domain/Node';
import { RegisterNodeServiceInterface } from './INodeRegisterService';
import { NodeInterface } from '../domain/INode';
import { NodeRepositoryInterface } from '../repository/INode_Repository';
import { ConsoleLogger } from '@node-ts/logger-core';
import { Node_DtoMapper } from '../mappers/Node_DtoMapper';

@Service('node.Registerservice')
export default class RegisterNodeService implements RegisterNodeServiceInterface {
	constructor(@Inject('node.repository') private nodeRepo: NodeRepositoryInterface) {}

	async registerNode(object): Promise<any> {
		if (object.crewTravelTimeReferenceNode) {
			if (object.crewTravelTimeReferenceNode !== object.shortName) {
				// if it dosent refers to the same node it will search in database for that node, else it refers to it self
				await this.nodeRepo
					.exists({ shortName: object.crewTravelTimeReferenceNode })
					.then((bool) => {
						if (bool == true) {
						} else {
							throw new Error('the node referenced by crew travel time does not exist isn the db');
						}
					})
					.catch((err) => {
						return new Promise(function(resolve, reject) {
							return reject(err);
						});
					});
			}
		}

		//let node =
		let creatednode;
		let savednode;

		const dto2domain = Node_DtoMapper.mapDTO2Domain(object);

		await Node.create(dto2domain)
			.then(async (node) => {
				creatednode = node;
			})
			.catch(async (err) => {
				return new Promise(function(resolve, reject) {
					return reject(err);
				});
			});

		const domain2persistence = Node_DtoMapper.mapDomain2Persistence(creatednode);

		await this.nodeRepo
			.create(domain2persistence)
			.then((node) => {
				savednode = node;
			})
			.catch((err) => {
				return new Promise(function(resolve, reject) {
					return reject(err);
				});
			});

		return new Promise(function(resolve, reject) {
			const dto = Node_DtoMapper.map2DTO(creatednode);

			return resolve(dto);
		});
	}

	private async checkifNodeExists(shortname: string) {
		return await this.nodeRepo.exists({ shortName: shortname });
	}
}
