
import { DriverTypeActionsService } from 'src/app/core/services/driverType-actions/driver-type-actions.service';
import { DriverTypeInterface } from '../../shared/models/DriverType/DriverTypeInterface';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-driver-type-registration',
  templateUrl: './driver-type-registration.component.html',
  styleUrls: ['./driver-type-registration.component.css']
})
export class DriverTypeRegistrationComponent implements OnInit {

  public driverType = {
    name: undefined,
    description: undefined
  };

  errMessage:string;
  successMessage:string;

  


  constructor(private driverTypeService : DriverTypeActionsService) { }

  ngOnInit(): void {
  }

  async onSubmit(form){

    try{
      this.driverTypeService.registerDriverType(this.driverType as DriverTypeInterface)
      .subscribe((data) => {
          this.errMessage = undefined;
          this.successMessage = 'Creation of DriverType successful';
          form.resetForm();
          return data;
      },
      (error)=>{
          this.handleErrorsFromServer(error);
          return error;
      });
    }catch (err){
      this.successMessage = undefined;
      this.errMessage = err.message;
      return err;
    }

  }

  handleErrorsFromServer(error) {
    this.successMessage = undefined;
    if(error.error.includes('duplicate')){
      this.errMessage = 'ERROR: The DriverType you are trying to create already exists in the database';
    }else if (error.error.includes('proxy')) {
			this.errMessage = 'ERROR: could not connect to backend server';
		}else{
      this.errMessage = error.error;
    }
  }
}
