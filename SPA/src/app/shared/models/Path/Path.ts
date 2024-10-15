import { PathInterface } from './PathInterface';
import { PathSegmentInterface } from '../Path/PathSegment/PathSegmentInterface';
import { PathSegment } from '../Path/PathSegment/PathSegment';

export class Path implements PathInterface {
	key: string;
	line: string;
	type: string;
	pathSegments: PathSegmentInterface[];
	isEmpty: boolean;

	private constructor(
		key: string,
		line: string,
		type: string,
		pathSegments: PathSegmentInterface[],
		isEmpty: boolean
	) {
		this.key = key;
		this.line = line;
		this.type = type;
		this.pathSegments = pathSegments;
		this.isEmpty = isEmpty;


	}

	private static validate(object: PathInterface) {
		let errors: Error[];

		if (object.key) {
			if (object.key.length < 2) {
				throw new Error('the identification is too short');
			}
		} else {
			throw new Error('Identification is required');
		}

		if (object.line == '' || object.line == undefined) {
			throw new Error('Line is required');
		}

		if (object.type == '' || object.type == undefined) {
			throw new Error('Path type is required');
		}

		if (object.pathSegments == undefined || object.pathSegments.length == 0) {
			throw new Error('Must add segments to the path');
		}
	}

	public static create(object: PathInterface) {
		try {
			let newArray: PathSegmentInterface[] = [];
			
			let newPathSegment;
			for (let pathSegment of object.pathSegments) {

				newPathSegment = PathSegment.create(pathSegment);
				newArray.push(newPathSegment);
			}

			object.pathSegments = newArray;
			this.validate(object);
			return new Path(
				object.key,
				object.line,
				object.type,
				object.pathSegments,
				object.isEmpty
			);
		} catch (err) {
			throw err;
			// throw new Error(
			// 	'An unexpected error happened, check the required fields'
			// );
		}

	}
}
