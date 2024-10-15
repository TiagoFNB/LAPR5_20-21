
import { PathSegmentInterface } from './PathSegmentInterface';

export class PathSegment implements PathSegmentInterface {
	node1: string;
	node2: string;
	duration: number;
	distance: number;

	private constructor(
        node1: string,
        node2: string,
        duration: number,
        distance: number
	) {
		this.node1 = node1;
		this.node2 = node2;
		this.duration = duration;
		this.distance = distance;
	}

	private static validate(object: PathSegmentInterface) {
		let errors: Error[];

		if (object.node1 == '' || object.node1 == undefined) {
			throw new Error('First node is required');
		}

		if (object.node2 == '' || object.node2 == undefined) {
			
			throw new Error('Second node is required');
		}

		if (object.duration == 0|| object.duration == undefined) {
			throw new Error('Duration is required');
		}

        if (object.distance == 0 || object.distance == undefined) {
			throw new Error('Distance is required');
		}

		if(object.node1 == object.node2){

			throw new Error('Nodes cant be equal');
		}
	}

	public static create(object) {
		try{
		this.validate(object);

		return new PathSegment(
			object.node1,
			object.node2,
			object.duration,
			object.distance
		);
		}catch(err){
			throw err;
			// throw new Error(
			// 	'An unexpected error happened, check the required fields'
			// );
		}

	}
}
