const joi = require('@hapi/joi');
import { ValueObject } from '../../utils/domain/ValueObject';

interface VehicleType_NameProps {
	name: string;
}

export class VehicleType_Name extends ValueObject<VehicleType_NameProps> {
	private constructor(props: VehicleType_NameProps) {
		super(props);
		const validationResult = this.validate(props.name);
		if (validationResult.error) {
			throw new Error(validationResult.error);
		}
	}

	public static create(name: string) {
		return new VehicleType_Name({ name: name });
	}

	public validate(name: string) {
		const schema = {
			name: joi.string().min(2).max(20).required()
		};
		return joi.validate({ name }, schema);
	}

	get name(): string {
		return this.props.name;
	}
}
