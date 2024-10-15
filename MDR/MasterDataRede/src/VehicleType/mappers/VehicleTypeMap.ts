import { IDTO_VehicleType } from '../DTO/IDTO_VehicleType';
import { VehicleType } from '../domain/VehicleType';
import { VehicleTypeInterface } from '../domain/IVehicleType';
export class VehicleType_Mapper {
	static map2DTO(vehicle: VehicleType): IDTO_VehicleType {
		const dto: IDTO_VehicleType = {
			name: vehicle.name.name,
			autonomy: vehicle.autonomy.autonomy,
			fuelType: vehicle.fuelType.type,
			costPerKm: `${vehicle.costPerKm.costPerKm} ${vehicle.costPerKm.currency}`,
			averageSpeed: vehicle.averageSpeed.avgSpeed,
			averageConsumption: `${vehicle.averageConsumption.averageConsumption} ${vehicle.averageConsumption.unit}`
		};
		if (vehicle.description) {
			dto.description = vehicle.description.desc;
		}
		return dto;
	}

	static mapDTO2Domain(raw) {
		const toDomain: any = {
			name: raw.name,
			autonomy: raw.autonomy,
			fuelType: raw.fuelType,
			costPerKm: raw.costPerKm,

			averageSpeed: raw.averageSpeed,
			averageConsumption: raw.averageConsumption
		};
		// optinla paramateres the user dont need to send them but if he sends then i use them
		if (raw.currency) {
			toDomain.currency = raw.currency;
		}
		if (raw.description) {
			toDomain.description = raw.description;
		}
		if (raw.key) {
			toDomain.key = raw.key;
		}

		return toDomain;
	}

	static mapDomain2Persistence(vehicleType: VehicleType) {
		const toPersistence: any = {
			name: vehicleType.name.name,
			autonomy: vehicleType.autonomy.autonomy,
			fuelType: vehicleType.fuelType.type,

			costPerKm: vehicleType.costPerKm.costPerKm,
			currency: vehicleType.costPerKm.currency,
			averageSpeed: vehicleType.averageSpeed.avgSpeed,

			averageConsumption: vehicleType.averageConsumption.averageConsumption,
			averageConsumption_unit: vehicleType.averageConsumption.unit,

			key: vehicleType.key
		};
		if (vehicleType.description) {
			toPersistence.description = vehicleType.description.desc;
		}

		return toPersistence;
	}
}
