const joi = require('@hapi/joi');
import { ValueObject } from '../../utils/domain/ValueObject';

interface VehicleType_DescriptionProps {
	desc: string;
}

export class VehicleType_Description extends ValueObject<VehicleType_DescriptionProps> {
	private constructor(props: VehicleType_DescriptionProps) {
		super(props);
		const validationResult = this.validate(props.desc);
		if (validationResult.error) {
			throw new Error(validationResult.error);
		}
	}

	public static create(desc: string) {
		return new VehicleType_Description({ desc: desc });
	}

	public validate(desc: string) {
		const schema = {
			desc: joi.string().min(2).max(250).required()
		};
		return joi.validate({ desc }, schema);
	}

	get desc(): string {
		return this.props.desc;
	}
}
