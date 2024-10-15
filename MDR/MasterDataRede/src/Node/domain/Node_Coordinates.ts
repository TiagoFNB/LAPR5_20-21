const joi = require('@hapi/joi');
import { ValueObject } from '../../utils/domain/ValueObject';

interface Node_CoordinatesProps {
	latitude: number;
	longitude: number;
}

export class Node_Coordinates extends ValueObject<Node_CoordinatesProps> {
	private constructor(props: Node_CoordinatesProps) {
		super(props);
		const validationResult = this.validate(props.latitude, props.longitude);
		if (validationResult.error) {
			throw new Error(validationResult.error);
		}
	}

	public static create(latitude: number, longitude: number) {
		return new Node_Coordinates({ latitude: latitude, longitude: longitude });
	}

	public validate(latitude: number, longitude: number) {
		const schema = {
			latitude: joi.number().min(-90).max(90).precision(7).required(),
			longitude: joi.number().min(-180).max(180).precision(7).required()
		};
		return joi.validate({ latitude, longitude }, schema);
	}

	get latitude(): number {
		return this.props.latitude;
	}
	get longitude(): number {
		return this.props.longitude;
	}
}
