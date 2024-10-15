import { Component, OnInit } from '@angular/core';
import { VehicleActionsService } from 'src/app/core/services/vehicle-actions/vehicle-actions.service';
import { VehicleDutyActionsService } from 'src/app/core/services/vehicleDuty-actions/vehicle-duty-actions.service';
import { VehicleDutyViewDTO } from 'src/app/shared/dtos/VehicleDuty/VehicleDutyViewDTO';

@Component({
  selector: 'app-vehicle-duty-registration',
  templateUrl: './vehicle-duty-registration.component.html',
  styleUrls: ['./vehicle-duty-registration.component.css']
})
export class VehicleDutyRegistrationComponent implements OnInit {

  public vehicleDuty: VehicleDutyViewDTO = {
    code:undefined,
    vehicleLicense:undefined
  };
  errorMessage: string;
	successMessage: string;
  loading=false;
  public vehicles: string[];
  constructor(private vehicleDutyService: VehicleDutyActionsService, private vehicleService:VehicleActionsService) { }

  ngOnInit(): void {

    this.vehicleService.getVehicles().subscribe(
		(data) => {
			this.vehicles = data.map((element) => {
				return element.license;
			});
		},
		(error) => {
			this.vehicles = [ 'Error obtaining vehicles.' ];
		}
	);
}
  

  async onSubmit(form) {
    this.loading = true;
		this.successMessage = undefined;
		this.errorMessage = undefined;
	  
		
	  
	  	
		  try {
			this.vehicleDutyService.registerVehicleDuty(this.vehicleDuty).subscribe(
			  (data) => {
				//Send success message to the right screen
				this.successMessage = 'VehicleDuty was successfully registered.';
				//Reset Form
				
				form.resetForm();
				this.loading = false;
				return data;
			  },
			  (error) => {
				//Send error to the right screen
				this.handleErrors(error.error);
				
				this.loading = false;
				return error;
			  }
			);
		  } catch (err) {
			this.handleErrors(err.message);
			
			this.loading = false;
		  }
		
		
	}

	handleErrors(err) {
		this.successMessage = undefined;

		if (err.includes('duplicate')) {
			this.errorMessage = 'Error: That vehicle duty already exists in the system';
		} else if (err.includes('proxy')) {
			this.errorMessage = 'Error: could not connect to backend server';
		} else {
			this.errorMessage = err;
		}
	}
}
