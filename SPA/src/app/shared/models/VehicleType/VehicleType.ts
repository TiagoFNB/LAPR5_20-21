import { validateLocaleAndSetLanguage } from 'typescript';
import { VehicleTypeInterface } from './VehicleTypeInterface';

export class VehicleType implements VehicleTypeInterface {
	name: string;
	autonomy: number;
	fuelType: string;
	costPerKm: number;
	averageSpeed: number;
	averageConsumption: number;
	description?: string;
	currency?: string;

	private constructor(
		name: string,
		description: string,
		autonomy: number,
		fuelType: string,
		costPerKm: number,
		currency: string,
		averageSpeed: number,
		averageConsumption: number
	) {
		this.name = name;
		if (description) {
			this.description = description;
		}
		this.autonomy = autonomy;
		this.fuelType = fuelType;
		this.costPerKm = costPerKm;
		if (currency) {
			this.currency = currency;
		} else {
			this.currency = 'EUR';
		}

		this.averageSpeed = averageSpeed;
		this.averageConsumption = averageConsumption;
	}

	public static create(vehicleTypePrototype: VehicleTypeInterface) {

		this.validate(
			vehicleTypePrototype.name,
			vehicleTypePrototype.description,
			vehicleTypePrototype.autonomy,
			vehicleTypePrototype.fuelType,
			vehicleTypePrototype.costPerKm,
			vehicleTypePrototype.currency,
			vehicleTypePrototype.averageSpeed,
			vehicleTypePrototype.averageConsumption
		);

		return new VehicleType(
			vehicleTypePrototype.name,
			vehicleTypePrototype.description,
			vehicleTypePrototype.autonomy,
			vehicleTypePrototype.fuelType,
			vehicleTypePrototype.costPerKm,
			vehicleTypePrototype.currency,
			vehicleTypePrototype.averageSpeed,
			vehicleTypePrototype.averageConsumption
		);
	}

	private static validate(
		name: string,
		description: string,
		autonomy: number,
		fuelType: string,
		costPerKm: number,
		currency: string,
		averageSpeed: number,
		averageConsumption: number
	) {
		if (name) {
			if (name.length < 2 || name.length > 20) {
				throw new Error('Name length must be between 2 and 20 characters');
			}
		} else {
			throw new Error('Name must be specified');
		}

		if (description) {
			if (description.length > 250) {
				throw new Error('Description length must be between 250 characters maximum');
			}
		}

		if (autonomy) {
			if (autonomy < 0.01) {
				throw new Error('Autonomy value is too low, check it again please');
			}
		} else {
			throw new Error('Autonomy must be specified');
		}

		if (fuelType) {
			const validFuelTypes: string[] = [ 'diesel', 'electric', 'gasoline', 'gpl', 'hydrogen' ];
			if (!validFuelTypes.includes(fuelType)) {
				throw new Error('Fuel type must be one of those: ' + validFuelTypes);
			}
		} else {
			throw new Error('Fuel type must be specified');
		}

		if (costPerKm) {
			if (costPerKm < 0.01) {
				throw new Error('Cost Per Km value is too low, check it again please');
			}
		} else {
			throw new Error('Cost Per Km must be specified');
		}
		if (currency) {
			const validCurrencies: string[] = [ 'EUR', 'BRL', 'USD', 'GBP' ];
			if (!validCurrencies.includes(currency)) {
				throw new Error('Currency must be one of those' + validCurrencies);
			}
		}

		if (averageSpeed) {
			if (averageSpeed < 0.01) {
				throw new Error('Average Speed value is too low, check it again please');
			}
		} else {
			throw new Error('Average Speed must be specified');
		}

		if (averageConsumption) {
			if (averageConsumption < 0.01) {
				throw new Error('average Consumption value is too low, check it again please');
			}
		} else {
			throw new Error('average Consumption must be specified');
		}
	}
}
