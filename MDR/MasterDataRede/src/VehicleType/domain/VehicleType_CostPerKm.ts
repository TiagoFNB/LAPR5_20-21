const joi = require('@hapi/joi');
import { ValueObject } from '../../utils/domain/ValueObject';

interface VehicleType_CostPerKmProps {
	cost: number;
	currency: string;
}

export class VehicleType_CostPerKm extends ValueObject<VehicleType_CostPerKmProps> {
	private constructor(props: VehicleType_CostPerKmProps) {
		super(props);
		const validationResult = this.validate(props.cost, props.currency);

		if (validationResult.error) {
			throw new Error(validationResult.error);
		}
	}

	public static create(cost: number, currency?: string) {
		if (currency == undefined) {
			currency = 'EUR';
		}
		return new VehicleType_CostPerKm({ cost: cost, currency: currency });
	}

	private validate(cost: number, currency: string) {
		const schema = {
			cost: joi.number().min(0.01).required(),
			currency: joi.string().valid('EUR', 'BRL', 'USD', 'GBP').required()
			//currency: joi.string().currency().required()
		};

		const r = joi.validate({ cost, currency }, schema);

		return r;
	}

	get costPerKm(): number {
		return this.props.cost;
	}
	get currency(): string {
		return this.props.currency;
	}
}
