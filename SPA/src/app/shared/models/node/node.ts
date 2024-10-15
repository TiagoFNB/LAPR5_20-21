import { NodeInterface } from './NodeInterface';
export class Node implements NodeInterface {
	name: string;
	shortName: string;
	latitude: number;
	longitude: number;
	isDepot: string;
	isReliefPoint: string;
	crewTravelTimes: number;
	crewTravelTimeReferenceNode: string;

	private constructor(
		name: string,
		shortName: string,
		latitude: number,
		longitude: number,
		isDepot,
		isReliefPoint,
		crewTravelTimes?: number,
		crewTravelTimeReferenceNode?: string
	) {
		this.name = name;
		this.shortName = shortName;
		this.latitude = latitude;
		this.longitude = longitude;
		if (isDepot == true || isDepot == 'true') {
			this.isDepot = 'true';
		} else {
			this.isDepot = 'false';
		}
		if (isReliefPoint == true || isReliefPoint == 'true') {
			this.isReliefPoint = 'true';
		} else {
			this.isReliefPoint = 'false';
		}

		if (crewTravelTimes) {
			this.crewTravelTimes = crewTravelTimes;
		}
		if (crewTravelTimeReferenceNode) {
			this.crewTravelTimeReferenceNode = crewTravelTimeReferenceNode;
		}
	}

	private static validate(object: NodeInterface) {
		let errors: Error[];
		//name validation
		if (object.name) {
			if (object.name.length < 2) {
				throw new Error('the name is too short');
			}
		} else {
			throw new Error('Name is required');
		}

		if (object.shortName == '' || object.shortName == undefined) {
			throw new Error('ShortName is required');
		}

		if (object.shortName == '' || object.shortName == undefined) {
			throw new Error('ShortName is required');
		}

		if (object.latitude < -90 || object.latitude > 90 || (object.longitude < -180 || object.longitude > 180)) {
			//coordinates validations
			//errors.push(new Error('the name is too short'));
			throw new Error('check value of coordinates, -90< latitude >90   and -180< longitude >180');
		}
	}

	public static create(object) {
		this.validate(object);

		if (
			object.crewTravelTimes == undefined &&
			(object.crewTravelTimeReferenceNode == undefined || object.crewTravelTimeReferenceNode == '')
		) {
			return new Node(
				object.name,
				object.shortName,
				object.latitude,
				object.longitude,
				object.isDepot,
				object.isReliefPoint
			);
		}

		if (
			object.crewTravelTimes &&
			(object.crewTravelTimeReferenceNode == undefined || object.crewTravelTimeReferenceNode == '')
		) {
			return new Node(
				object.name,
				object.shortName,
				object.latitude,
				object.longitude,
				object.isDepot,
				object.isReliefPoint,
				object.crewTravelTimes
			);
		}

		if (object.crewTravelTimes && object.crewTravelTimeReferenceNode) {
			return new Node(
				object.name,
				object.shortName,
				object.latitude,
				object.longitude,
				object.isDepot,
				object.isReliefPoint,
				object.crewTravelTimes,
				object.crewTravelTimeReferenceNode
			);
		}
		throw new Error(
			'An unexpected error happened, check the required fields and if you specify a reference node dont forget to specify the duration'
		);
	}
}
