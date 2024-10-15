import { Component, OnInit } from '@angular/core';
import { VehicleTypeActionsService } from '../../core/services/vehicleType-actions/vehicle-type-actions.service';
@Component({
	selector: 'app-vehicle-type-registration',
	templateUrl: './vehicle-type-registration.component.html',
	styleUrls: [ './vehicle-type-registration.component.css' ]
})
export class VehicleTypeRegistrationComponent implements OnInit {
	public vehicleType = {
		name: undefined,
		description: undefined, //n
		fuelType: undefined,
		costPerKm: undefined,
		currency: undefined, //n

		averageSpeed: undefined,
		averageConsumption: undefined,
		autonomy: undefined
	};

	public fuelTypes: string[] = [ 'diesel', 'electric', 'gasoline', 'gpl', 'hydrogen' ];
	public currenciesSupported: string[] = [ 'EUR', 'BRL', 'USD', 'GBP' ];
	public successMessage: string;
	public errorMessage: string;

	constructor(private vehicleTypeActionsService: VehicleTypeActionsService) {}

	ngOnInit(): void {}

	onSubmit(form) {
		try {
			this.vehicleTypeActionsService.registerVehicleType(this.vehicleType).subscribe(
				(data) => {
					this.errorMessage = undefined;
					this.successMessage = 'Vehicle Type Created Sucessfully ';

					form.resetForm();
					return data;
				},
				(error) => {
					this.handleErrors(error.error);
					return error;
				}
			);
		} catch (err) {
			this.handleErrors(err.message);
		}
	}

	handleErrors(error) {
		this.successMessage = undefined;
		if (error.substring(0, 16) == 'E11000 duplicate') {
			this.errorMessage = 'Error: That vehicle type already exists in the system';
		} else if (error.includes('proxy')) {
			this.errorMessage = 'Error: could not connect to backend server';
		} else {
			this.errorMessage = error;
		}
	}
}
