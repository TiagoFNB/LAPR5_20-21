const joi = require('@hapi/joi');
import { ValueObject } from '../../utils/domain/ValueObject';

interface VehicleType_AverageSpeedProps {
	avgSpeed: number;
}

export class VehicleType_AverageSpeed extends ValueObject<VehicleType_AverageSpeedProps> {
	private constructor(props: VehicleType_AverageSpeedProps) {
		super(props);
		const validationResult = this.validate(props.avgSpeed);
		if (validationResult.error) {
			throw new Error(validationResult.error);
		}
	}

	public static create(avgSpeed: number) {
		return new VehicleType_AverageSpeed({ avgSpeed: avgSpeed });
	}

	public validate(avgSpeed: number) {
		const schema = {
			avgSpeed: joi.number().min(0.01).required()
		};
		return joi.validate({ avgSpeed }, schema);
	}

	get avgSpeed(): number {
		return this.props.avgSpeed;
	}
}
