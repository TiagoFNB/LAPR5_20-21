import { Node } from '../../Node/domain/Node';
import { IDTO_Path} from '../interfaces/IDTO_Path';
import { IDTO_Path2Persistence } from '../interfaces/IDTO_Path2Persistence';
import { PathSegment } from '../domain/PathSegment';
import { PathType } from '../interfaces/PathType';
import { isEmptyBindingElement } from 'typescript';
export class Path_DtoMapper {
	static map2Dto_Path(
		key: string,
		line: string,
		type: PathType,
		pathSegments: [PathSegment],
		isEmpty:boolean
	): IDTO_Path {
		let dto: any = {
			key: key,
			line:line,
			type:type,
			isEmpty: isEmpty
		}

		let newPathSegments = pathSegments.map(function (newObj) {
            return {
                node1: newObj.node1,
                node2: newObj.node2,
                duration: newObj.duration,
                distance: newObj.distance
            };
		});

		dto.pathSegments= newPathSegments;
		
		return dto;
	}

	static mapDTO2Domain(obj){
		const toDomain: IDTO_Path = {
			key: obj.key,
			line: obj.line,
			type: obj.type,
			pathSegments: obj.pathSegments,
			isEmpty:obj.isEmpty
		};
		return toDomain;
	}

	static mapDomain2Persistence_Path(path): IDTO_Path2Persistence {
		let dto : any = {
			key: path.key.key,
			line: path.line.code,
			type: path.type,
            // pathSegments: path.pathSegments,
            isEmpty: path.isEmpty
		};
		
		let newPathSegments = path.pathSegments.map(function (oi) {
            return {
                node1: oi.node1.shortName,
                node2: oi.node2.shortName,
                duration: oi.duration,
                distance: oi.distance
            };
        });

		dto.pathSegments = newPathSegments;
		return dto;
	}

	/**
	 * Maps to presentation without showing line attribute
	 * 
	 * @param key 
	 * @param type 
	 * @param pathSegments 
	 * @param isEmpty 
	 */
	static mapPersistence2Presentation(key: string,type: PathType,pathSegments: [PathSegment],isEmpty:boolean){
		let dto = {
			key: key,
			type:type,
			pathSegments: pathSegments,
			isEmpty: isEmpty
		}
		return dto;
	}

	static mapPersistence2PresentationDTO(key: string,line: string, type: PathType,pathSegments: [PathSegment]){
		let dto = {
			key: key,
			line: line,
			type:type,
			pathSegments: pathSegments,
		}
		return dto;
	}
}
