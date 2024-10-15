import { Service, Container, Inject } from 'typedi';

import { IDTO_Node } from '../DTO/IDTO_Node';
import { IObtainNodeService } from './IObtainNodeService';

import { NodeRepositoryInterface } from '../repository/INode_Repository';

import { Node_DtoMapper } from '../mappers/Node_DtoMapper';
import { Node } from '../domain/Node';
import { ConsoleLogger } from '@node-ts/logger-core';

@Service('node.ObtainNodeService')
export default class ObtainNodeService implements IObtainNodeService {
	constructor(@Inject('node.repository') private nodeRepo: NodeRepositoryInterface) {}

	async listNodesByShortNameOrName(queryObject): Promise<any> {
		let DTOnodeList: IDTO_Node[];
		try {
			this.validateUrl(queryObject);
		} catch (err) {
			throw new Error(err);
		}

		await this.nodeRepo
			.findWithfilter_AndOr_Sort(queryObject.filterby, queryObject.filtertype, queryObject.sortby)
			.then(async (nodeList) => {
				const promises = await Promise.all(
					(DTOnodeList = nodeList.map(async function(element) {
						const object = Node_DtoMapper.mapFromPersistence2Domain(element);
						let creatednode;
						await Node.create(object).then((node) => {
							creatednode = node;
						});
						const nodeDto = Node_DtoMapper.map2DTO(creatednode);
						return nodeDto;

					}))
				);
			});

		return Promise.all(DTOnodeList);
	}

	private validateUrl(queryObject) {
		if (queryObject.filterby == undefined && queryObject.sortby == undefined) {
			throw new Error('you must specify a filter, a sort or both');
		}
		if (
			(queryObject.filterby != undefined && queryObject.filtertype == undefined) ||
			(queryObject.filterby == undefined && queryObject.filtertype != undefined)
		) {
			throw new Error('you are specifying an incomplete filter');
		}
		if (queryObject.filterby != undefined && queryObject.sortby != undefined) {
			if (
				(queryObject.filterby != 'name' && queryObject.filterby != 'shortName') ||
				(queryObject.sortby != 'name' && queryObject.sortby != 'shortName')
			) {
				throw new Error('you can only filter and sort by name or shortName');
			}
		} else if (queryObject.filterby == undefined) {
			if (queryObject.sortby != 'name' && queryObject.sortby != 'shortName') {
				throw new Error('you can only  sort by name or shortName');
			}
		} else if (queryObject.sortby == undefined) {
			if (queryObject.filterby != 'name' && queryObject.filterby != 'shortName') {
				throw new Error('you can only  filter by name or shortName');
			}
		}
	}
}
