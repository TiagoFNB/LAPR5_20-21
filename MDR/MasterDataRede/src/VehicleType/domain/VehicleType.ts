import { VehicleTypeInterface } from './IVehicleType';

import { VehicleType_Name } from './VehicleType_Name';
import { VehicleType_Description } from './VehicleType_Description';
import { VehicleType_FuelType } from './VehicleType_FuelType';
import { VehicleType_CostPerKm } from './VehicleType_CostPerKm';
import { VehicleType_AverageSpeed } from './VehicleType_AverageSpeed';
import { VehicleType_AverageConsumption } from './VehicleType_AverageConsumption';
import { VehicleType_Autonomy } from './VehicleType_Autonomy';

const joi = require('@hapi/joi');

export class VehicleType implements VehicleTypeInterface {
	private _name: VehicleType_Name;

	private _description: VehicleType_Description;

	private _fuelType: VehicleType_FuelType;

	private _costPerKm: VehicleType_CostPerKm;

	private _averageSpeed: VehicleType_AverageSpeed;
	private _averageConsumption: VehicleType_AverageConsumption;
	private _autonomy: VehicleType_Autonomy;

	private _key: string;

	constructor(
		name: string,
		autonomy: number,
		fuelType: string,
		averageSpeed: number,
		averageConsumption: number,
		costPerKm: number,
		description: string,
		currency?: string,
		key?: string
	) {
		try {
			this._name = VehicleType_Name.create(name);

			this._autonomy = VehicleType_Autonomy.create(autonomy);

			this._fuelType = VehicleType_FuelType.create(fuelType);

			if (fuelType == 'electric') {
				this._averageConsumption = VehicleType_AverageConsumption.create(averageConsumption, 'Kw');
			} else {
				this._averageConsumption = VehicleType_AverageConsumption.create(averageConsumption, 'l');
			}

			this._averageSpeed = VehicleType_AverageSpeed.create(averageSpeed);

			this._costPerKm = VehicleType_CostPerKm.create(costPerKm, currency);
			if (description) this._description = VehicleType_Description.create(description);

			if (key) this._key = key;
		} catch (err) {
			throw new Error(err);
		}
	}

	static async create(object): Promise<VehicleType> {
		return new Promise(function(resolve, reject) {
			try {
				const vehicleType = new VehicleType(
					object.name,
					object.autonomy,
					object.fuelType,
					object.averageSpeed,
					object.averageConsumption,
					object.costPerKm,
					object.description,
					object.currency,
					object.key
				);
				return resolve(vehicleType);
			} catch (e) {
				return reject(e);
			}
		});
	}

	public get name(): VehicleType_Name {
		return this._name;
	}

	public get autonomy(): VehicleType_Autonomy {
		return this._autonomy;
	}

	public get fuelType(): VehicleType_FuelType {
		return this._fuelType;
	}

	public get averageSpeed(): VehicleType_AverageSpeed {
		return this._averageSpeed;
	}

	public get costPerKm(): VehicleType_CostPerKm {
		return this._costPerKm;
	}

	public get averageConsumption(): VehicleType_AverageConsumption {
		return this._averageConsumption;
	}

	public get description(): VehicleType_Description {
		return this._description;
	}
	public get key(): string {
		return this._key;
	}

	static obtainIdField(): string {
		return 'name';
	}
}
