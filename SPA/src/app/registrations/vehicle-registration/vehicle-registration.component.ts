import { VehicleViewDTO } from './../../shared/dtos/Vehicle/VehicleViewDto';
import { Component, OnInit } from '@angular/core';
import { VehicleTypeActionsService } from 'src/app/core/services/vehicleType-actions/vehicle-type-actions.service';
import { VehicleActionsService } from 'src/app/core/services/vehicle-actions/vehicle-actions.service';

@Component({
  selector: 'app-vehicle-registration',
  templateUrl: './vehicle-registration.component.html',
  styleUrls: ['./vehicle-registration.component.css'],
  
})
export class VehicleRegistrationComponent implements OnInit {

  public vehicle: VehicleViewDTO = {
    license: undefined,
    vin: undefined,
    type:undefined,
    entryDateOfService:undefined,
  };
  loading=false;
  maxDate: Date;
  public vehicleTypes: string[];


  errorMessage: string;
	successMessage: string;
  constructor(private vehicleTypeService: VehicleTypeActionsService,private vehicleService: VehicleActionsService) { 
    const currentDate = new Date();
    this.maxDate=currentDate;
  }

  ngOnInit(): void {
    this.vehicleTypeService.getVehicleTypes().subscribe(
			(data) => {
				this.vehicleTypes = data.map((element) => {
					return element.name;
				});
			},
			(error) => {
				this.vehicleTypes = [ 'Error obtaining vehicle types.' ];
			}
		);
  }

  async onSubmit(form) {
	    //console.log(this.vehicle);
		this.loading = true;
		this.successMessage = undefined;
		this.errorMessage = undefined;
	  
		
	  
	  	
		  try {
			this.vehicleService.registerVehicle(this.vehicle).subscribe(
			  (data) => {
				//Send success message to the right screen
				this.successMessage = 'Vehicle was successfully registered.';
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
			this.errorMessage = 'Error: That vehicle already exists in the system';
		} else if (err.includes('proxy')) {
			this.errorMessage = 'Error: could not connect to backend server';
		} else {
			this.errorMessage = err;
		}
	}

}
