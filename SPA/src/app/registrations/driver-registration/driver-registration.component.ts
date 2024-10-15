import { Component, OnInit } from '@angular/core';
import { DriverActionsService } from 'src/app/core/services/driver-actions/driver-actions.service';
import { DriverTypeActionsService } from 'src/app/core/services/driverType-actions/driver-type-actions.service';
import { DriverViewDTO } from 'src/app/shared/dtos/Driver/DriverViewDto';

@Component({
  selector: 'app-driver-registration',
  templateUrl: './driver-registration.component.html',
  styleUrls: ['./driver-registration.component.css']
})
export class DriverRegistrationComponent implements OnInit {
  public driver: DriverViewDTO = {
    mechanographicNumber: undefined,
    name: undefined,
    birthDate: undefined,
    citizenCardNumber: undefined,
    entryDate: undefined,
    departureDate:undefined,
    fiscalNumber: undefined,
	type:undefined,
	license:undefined,
	licenseDate:undefined
  }

  loading=false;
  maxDate: Date;

  maxBirthDate:Date;
  public driverTypes: string[];

  errorMessage: string;
	successMessage: string;

  constructor(private driverTypeService: DriverTypeActionsService,private driverService: DriverActionsService) { 
    
    this.maxDate=new Date();
    
   
    this.maxBirthDate=new Date();
    this.maxBirthDate.setFullYear( this.maxBirthDate.getFullYear() - 18 );
  }

  ngOnInit(): void {
    this.driverTypeService.getDriverTypes().subscribe(
			(data) => {
				this.driverTypes = data.map((element) => {
					return element.name;
				});
			},
			(error) => {
				this.driverTypes = [ 'Error obtaining driver types.' ];
			}
		);
  }


  async onSubmit(form) {
    this.loading = true;
		this.successMessage = undefined;
		this.errorMessage = undefined;
	  
		
	  
	  	
		  try {
			this.driverService.registerDriver(this.driver).subscribe(
			  (data) => {
				//Send success message to the right screen
				this.successMessage = 'Driver was successfully registered.';
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
			this.errorMessage = 'Error: That driver already exists in the system';
		} else if (err.includes('proxy')) {
			this.errorMessage = 'Error: could not connect to backend server';
		} else {
			this.errorMessage = err;
		}
	}
  }

