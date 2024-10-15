export interface IDTO_VehicleType {
	key?: string;
	name: string;
	autonomy: number;
	fuelType: string;
	costPerKm: string; // number  + currency
	averageSpeed: number;
	averageConsumption: string; // number + unity
	description?: string;
}
