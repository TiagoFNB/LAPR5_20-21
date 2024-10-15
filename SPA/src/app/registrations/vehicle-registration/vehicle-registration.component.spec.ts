import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { throwError } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { VehicleActionsService } from 'src/app/core/services/vehicle-actions/vehicle-actions.service';
import { VehicleTypeActionsService } from 'src/app/core/services/vehicleType-actions/vehicle-type-actions.service';

import { VehicleRegistrationComponent } from './vehicle-registration.component';

describe('VehicleRegistrationComponent', () => {
  let component: VehicleRegistrationComponent;
  let fixture: ComponentFixture<VehicleRegistrationComponent>;
 

  let vehicleServMock = jasmine.createSpyObj(VehicleActionsService,['registerVehicle']);
  let vehicleTypeServMock = jasmine.createSpyObj(VehicleTypeActionsService,['getVehicleTypes']);
  let testbed;

  beforeEach(async () => {
    testbed=await TestBed.configureTestingModule({
      declarations: [ VehicleRegistrationComponent ],
      providers:[{provide:VehicleActionsService, useValue: vehicleServMock},
        {provide:VehicleTypeActionsService, useValue: vehicleTypeServMock}],
      imports: [
				FormsModule,
				AppRoutingModule,
				MatSelectModule,
				BrowserModule,
        BrowserAnimationsModule,
        MatGridListModule,
				MatInputModule,
				MatFormFieldModule,
				MatDatepickerModule,
				MatNativeDateModule,
			]
    })
    .compileComponents();
  });

 

  it('should create', () => {
	vehicleServMock.registerVehicle.and.returnValue(of({ name: 'dt1' }));
	vehicleTypeServMock.getVehicleTypes.and.returnValue(of([{ name: 'dt1' },{ name: 'dt2' }]));
    fixture = TestBed.createComponent(VehicleRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('create a Vehicle success case 1', async () => {
		vehicleServMock.registerVehicle.and.returnValue(of({ name: 'dt1' }));
		vehicleTypeServMock.getVehicleTypes.and.returnValue(of([]));
		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleRegistrationComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();


    component.vehicle.license = 'AA-01-AA';
    component.vehicle.type = 'TYPE1';
    component.vehicle.entryDateOfService=new Date();
    component.vehicle.vin='12345678901234567'

		//submit
		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Vehicle was successfully registered.');
		expect(component.errorMessage).toBeUndefined();
	});

	it('create a Vehicle error  case 1 (error comes from service)', async () => {
		vehicleServMock.registerVehicle.and.returnValue(throwError({ error: 'err1' }));
    vehicleTypeServMock.getVehicleTypes.and.returnValue(of([]));

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleRegistrationComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();


		component.vehicle.license = 'AA-01-AA';
    component.vehicle.type = 'TYPE1';
    component.vehicle.entryDateOfService=new Date();
    component.vehicle.vin='12345678901234567'


		//submit
		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.errorMessage).toEqual('err1');
		expect(component.successMessage).toBeUndefined();
  });
  
  it('Should not create Vehicle : obtain a list returns an error', () => {
		//Mock creations
		
		vehicleTypeServMock.getVehicleTypes.and.returnValue(throwError({ error: 'err1' }));
    vehicleServMock.registerVehicle.and.returnValue(throwError({ error: 'err1' }));


		

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();


		//Check if all values are correctly initialized after ngOnInit
	

	
	
	
		expect(component.vehicleTypes).toEqual([ 'Error obtaining vehicle types.' ]);
		

    component.onSubmit(new NgForm(undefined, undefined));
		expect(component.errorMessage).toEqual('err1');
		expect(component.successMessage).toBeUndefined();
	});



});
