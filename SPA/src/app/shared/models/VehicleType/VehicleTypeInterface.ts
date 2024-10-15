export interface VehicleTypeInterface {
	name: string;
	autonomy: number;
	fuelType: string;
	costPerKm: number;
	averageSpeed: number;
	averageConsumption: number;
	currency?: string;
	description?: string;
}
