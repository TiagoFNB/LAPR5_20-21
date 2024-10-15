const joi = require('@hapi/joi');
import { ValueObject } from '../../utils/domain/ValueObject';

interface VehicleType_AverageConsumptionProps {
	averageConsumption: number;
	unit: string;
}

export class VehicleType_AverageConsumption extends ValueObject<VehicleType_AverageConsumptionProps> {
	private constructor(props: VehicleType_AverageConsumptionProps) {
		super(props);
		const validationResult = this.validate(props.averageConsumption, props.unit);
		if (validationResult.error) {
			throw new Error(validationResult.error);
		}
	}

	public static create(averageConsumption: number, unit: string) {
		return new VehicleType_AverageConsumption({ averageConsumption: averageConsumption, unit: unit });
	}

	public validate(averageConsumption: number, unit: string) {
		const unitInLowerCase = unit.toLocaleLowerCase();
		const schema = {
			averageConsumption: joi.number().min(0.01).required(),
			unitInLowerCase: joi.string().valid('l', 'kw', 'gas', 'gasoline', 'gpl').required()
		};
		return joi.validate({ averageConsumption, unitInLowerCase }, schema);
	}

	get averageConsumption(): number {
		return this.props.averageConsumption;
	}
	get unit(): string {
		return this.props.unit;
	}
}
