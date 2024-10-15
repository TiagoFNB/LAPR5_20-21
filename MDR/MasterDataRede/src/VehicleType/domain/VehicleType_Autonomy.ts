const joi = require('@hapi/joi');
import { ValueObject } from '../../utils/domain/ValueObject';

interface VehicleType_AutonomyProps {
	autonomy: number;
}

export class VehicleType_Autonomy extends ValueObject<VehicleType_AutonomyProps> {
	private constructor(props: VehicleType_AutonomyProps) {
		super(props);
		const validationResult = this.validate(props.autonomy);
		if (validationResult.error) {
			throw new Error(validationResult.error);
		}
	}

	public static create(autonomy: number) {
		return new VehicleType_Autonomy({ autonomy: autonomy });
	}

	public validate(autonomy: number) {
		const schema = {
			autonomy: joi.number().min(0.01).required()
		};
		return joi.validate({ autonomy }, schema);
	}

	get autonomy(): number {
		return this.props.autonomy;
	}
}
