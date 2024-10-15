const joi = require('@hapi/joi');
import { ValueObject } from '../../utils/domain/ValueObject';

interface VehicleType_FuelTypeProps {
	type: string;
}

export class VehicleType_FuelType extends ValueObject<VehicleType_FuelTypeProps> {
	private constructor(props: VehicleType_FuelTypeProps) {
		super(props);
		const validationResult = this.validate(props.type);
		if (validationResult.error) {
			throw new Error(validationResult.error);
		}
	}

	public static create(type: string) {
		let translatedType = this.fuelTypeTranslation(type);
		if (translatedType != undefined) {
			return new VehicleType_FuelType({ type: translatedType });
		} else {
			return new VehicleType_FuelType({ type: type });
		}
	}

	public validate(type: string) {
		let fueltype;
		if (type != undefined) {
			fueltype = type.toLocaleLowerCase();
		}
		const schema = {
			fueltype: joi.string().valid('diesel', 'electric', 'gasoline', 'gpl', 'hydrogen').required()
		};
		return joi.validate({ fueltype }, schema);
	}

	private static fuelTypeTranslation(fuelTypeCodes: string) {
		const schema = {
			fuelTypeCodes: joi.string().valid('1', '20', '23', '50', '75').required()
		};
		const validationResult = joi.validate({ fuelTypeCodes }, schema);
		if (validationResult.error) {
			return undefined;
		} else {
			switch (fuelTypeCodes) {
				case '1':
					return 'gasoline';
				case '20':
					return 'gpl';
				case '23':
					return 'diesel';
				case '50':
					return 'hydrogen';
				case '75':
					return 'electric';
			}
		}
	}

	get type(): string {
		return this.props.type;
	}
}
