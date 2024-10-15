import { IDTO_Node } from '../DTO/IDTO_Node';
import { Node } from '../domain/Node';
import { NodeInterface } from '../domain/INode';
export class Node_DtoMapper {
	static map2DTO(
		node: Node
		// name: string,
		// shortName: string,
		// latitude: number,
		// longitude: number,
		// isDepot: string,
		// isReliefPoint: string,
		// crewTravelTime?: number,
		// node?: string
	): IDTO_Node {
		const dto: IDTO_Node = {
			name: node.name,
			shortName: node.shortName.shortName,
			latitude: node.coordinates.latitude,
			longitude: node.coordinates.longitude,
			isDepot: node.node_Type.isDepot.toString(),
			isReliefPoint: node.node_Type.isReliefPoint.toString()
		};

		if (node.node_Type.crewTravelTimeDuration) {
			dto.crewTravelTimes = node.node_Type.crewTravelTimeDuration;
		}
		if (node.node_Type.crewTravelTimeReferenceNode) {
			dto.crewTravelTimeReferenceNode = node.node_Type.crewTravelTimeReferenceNode.shortName;
		}

		return dto;
	}

	static mapDTO2Domain(dto) {
		//console.log(dto);

		const toDomain: any = {
			name: dto.name,
			shortName: dto.shortName,
			latitude: dto.latitude,
			longitude: dto.longitude,
			key: dto.key,
			crewTravelTimes: dto.crewTravelTimes
		};
		if (dto.isDepot) {
			const depot = dto.isDepot.toLocaleLowerCase();
			if (depot === 'yes' || depot === 'true') {
				toDomain.isDepot = true;
			} else {
				toDomain.isDepot = false;
			}
		} else {
			toDomain.isDepot = false;
		}

		if (dto.isReliefPoint) {
			const reliefPoint = dto.isReliefPoint.toLocaleLowerCase();
			if (reliefPoint === 'yes' || reliefPoint === 'true') {
				toDomain.isReliefPoint = true;
			} else {
				toDomain.isReliefPoint = false;
			}
		} else {
			toDomain.isReliefPoint = false;
		}
		if (dto.crewTravelTimeReferenceNode) {
			toDomain.node = dto.crewTravelTimeReferenceNode;
		}

		return toDomain;
	}

	static mapDomain2Persistence(node) {
		const toPersistence: any = {
			name: node.name,
			shortName: node.shortName.shortName,
			coordinates: {
				latitude: node.coordinates.latitude,
				longitude: node.coordinates.longitude
			},
			isDepot: node.node_Type.isDepot,
			isReliefPoint: node.node_Type.isReliefPoint,

			key: node.key
		};

		if (node.node_Type.crewTravelTimeDuration) {
			toPersistence.crewTravelTimes_duration = node.node_Type.crewTravelTimeDuration;
		}
		if (node.node_Type.crewTravelTimeReferenceNode != undefined) {
			toPersistence.crewTravelTimes_node = node.node_Type.crewTravelTimeReferenceNode.shortName;
		}

		return toPersistence;
	}

	static mapFromPersistence2Domain(persistedObject) {
		// console.log('received node  map  pers 2 dom');
		// console.log(persistedObject);
		const toDomain: any = {
			name: persistedObject.name,
			shortName: persistedObject.shortName,
			latitude: persistedObject.coordinates.latitude,
			longitude: persistedObject.coordinates.longitude,
			isDepot: persistedObject.isDepot,
			isReliefPoint: persistedObject.isReliefPoint
		};
		if (persistedObject.key) {
			toDomain.key = persistedObject.key;
		}
		if (persistedObject.crewTravelTimes_duration) {
			toDomain.crewTravelTimes_duration = persistedObject.crewTravelTimeDuration;
		}
		if (persistedObject.crewTravelTimeReferenceNode) {
			toDomain.node = persistedObject.crewTravelTimeReferenceNode;
		}

		return toDomain;
	}
}
