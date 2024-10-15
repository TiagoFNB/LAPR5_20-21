import { NodeInterface } from './INode';
import { IDTO_Node } from '../DTO/IDTO_Node';
import { Node_ShortName } from './Node_ShortName';
import { Node_Coordinates } from './Node_Coordinates';
import { Node_Type } from './Node_Type';
const joi = require('@hapi/joi');
/*
class CrewTravelTimes {
	private _key: String;
	private _duration: Number;

	constructor(duration: Number, key?: String) {
		this._duration = duration;
		this._key = key;
	}
}
*/
export class Node implements NodeInterface {
	private _key: string;

	private _name: string;

	private _coordinates: Node_Coordinates;
	private _node_Type: Node_Type;
	private _shortName: Node_ShortName;
	// private _isDepot: boolean;
	// private _isReliefPoint: boolean;
	// private _crewTravelTimes_duration: Number;
	//private _crewTravelTimes: CrewTravelTimes;

	private constructor(
		name: string,
		latitude: number,
		longitude: number,
		shortName: string,
		isDepot?: boolean,
		isReliefPoint?: boolean,
		crewTravelTimes_duration?: number,
		key?: string,
		node?: string // crew travel reference node
	) {
		const validationResult = this.validation(name, key);
		if (validationResult.error) {
			throw new Error(validationResult.error);
		}
		this._name = name;
		this._coordinates = Node_Coordinates.create(latitude, longitude);

		this._shortName = Node_ShortName.create(shortName);

		if (key) this._key = key;

		if (!node && crewTravelTimes_duration && (isDepot == true || isReliefPoint == true)) {
			// if i receive no crew travel reference node but the node is Depot or Relief point with crew travel time duration i assume it refer to itself

			node = shortName;
		}
		// if(node && isDepot == false && isReliefPoint == false){
		// 	throw  new Error('You are trying to define a crew travel ')
		// }

		this._node_Type = Node_Type.create(isDepot, isReliefPoint, crewTravelTimes_duration, node);
	}

	private validation(name: string, key: string) {
		const schema = {
			name: joi.string().max(250).required(),
			key: joi.string().max(200).optional().empty('')
		};
		return joi.validate({ name, key }, schema);
	}

	static async create(object): Promise<Node> {
		return new Promise(function(resolve, reject) {
			try {
				const node = new Node(
					object.name,
					object.latitude,
					object.longitude,
					object.shortName,
					object.isDepot,
					object.isReliefPoint,
					object.crewTravelTimes,
					object.key,
					object.node
				);
				return resolve(node);
			} catch (e) {
				return reject(e);
			}
		});
	}

	public static obtainIdField(): string {
		return 'shortName';
	}

	public get key() {
		if (this._key != undefined) return this._key;
	}

	public get name(): string {
		return this._name;
	}

	public get coordinates(): Node_Coordinates {
		return this._coordinates;
	}

	public get node_Type(): Node_Type {
		return this._node_Type;
	}

	public get shortName(): Node_ShortName {
		return this._shortName;
	}
}
