import { Component, OnInit } from '@angular/core';
import { DriverActionsService } from 'src/app/core/services/driver-actions/driver-actions.service';
import { DriverDutyActionsService } from 'src/app/core/services/driverDuty-actions/driver-duty-actions.service';
import { DriverDutyViewDTO } from 'src/app/shared/dtos/DriverDuty/DriverDutyViewDTO';

@Component({
	selector: 'app-driver-duty',
	templateUrl: './driver-duty-registration.component.html',
	styleUrls: [ './driver-duty-registration.component.css' ]
})
export class DriverDutyRegistrationComponent implements OnInit {
	//Feedback messages
	public successMessage: string;
	public errorMessage: string;

	public driverDuty: DriverDutyViewDTO = {
		code: undefined,
		driverCode: undefined
	};

	public loading : boolean;

	//Receives the driver codes list from the database
	public driverCodesList: string[] = [];
	public driverList: any[] = [];
	constructor(private driverDutyService: DriverDutyActionsService, private driverService: DriverActionsService) {}

	ngOnInit(): void {
		this.loading = false;
	}

	/**
   * Whenever a user presses a key, obtains drivers that match the input
   */
	driverCodesInDB() {
		if (this.driverDuty.driverCode) {
			this.driverService.getDriverWithStartingId(this.driverDuty.driverCode).subscribe(
				(data) => {
					this.driverList = data;

					this.driverCodesList = data.map((element) => {
						return element.mechanographicNumber;
					});
				},
				(error) => {
					this.errorMessage=error.error;
				}
			);
			return this.driverCodesList;
		}
	}

	/**
   * This function runs when the form is submitted.
   * 
   * It runs local validations and resets the form state if the request to db was successfull
   * 
   * @param form 
   */
	onSubmit(form) {
		this.loading=true;
		//Reset feedback messages
		this.successMessage = undefined;
		this.errorMessage = undefined;

		//convertDriverNameToCode();

		try {
			this.driverDutyService.registerDriverDuty(this.driverDuty).subscribe(
				(data) => {
					//Send success message to the right screen
					this.successMessage = 'Driver Duty was successfully registered.';
					//Reset Form
					form.resetForm();
					this.loading = false;
				},
				(error) => {
					//Send error to the right screen
					this.errorMessage = this.handleErrors(error);
					this.loading = false;
				}
			);
		} catch (err) {
			this.errorMessage = err.message;
		}		
	}


	handleErrors(error) : string {
		if(error.error.includes("updating the entries")){
		  return "Error: Driver Duty with given code already exists.";
		}
		else{
		  return error.error;
		}
	  }

}
