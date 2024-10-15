import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { throwError } from 'rxjs';

import { of } from 'rxjs/internal/observable/of';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { VehicleTypeActionsService } from 'src/app/core/services/vehicleType-actions/vehicle-type-actions.service';

import { VehicleTypeRegistrationComponent } from './vehicle-type-registration.component';

describe('VehicleTypeRegistrationComponent', () => {
	let component: VehicleTypeRegistrationComponent;
	let fixture: ComponentFixture<VehicleTypeRegistrationComponent>;

	let testBed;

	//Create service mocks

	let vehicleTypeActionsServMock = jasmine.createSpyObj(VehicleTypeActionsService, [ 'registerVehicleType' ]);

	//nodeActionsServMock.getNodesShortNames.and.returnValue(of([]));
	beforeEach(async () => {
		testBed = await TestBed.configureTestingModule({
			declarations: [ VehicleTypeRegistrationComponent ],
			providers: [ { provide: VehicleTypeActionsService, useValue: vehicleTypeActionsServMock } ],
			imports: [
				FormsModule,
				AppRoutingModule,
				ColorPickerModule,
				MatSelectModule,
				BrowserModule,
				BrowserAnimationsModule
			]
		}).compileComponents();
	});

	it('component should be created', () => {
		//Refresh the mocks values
		//	vehicleTypeActionsServMock.registerVehicleType.and.returnValue(of([ 'vh1', 'vh2' ]));
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		expect(component).toBeTruthy();
	});

	it('Should create a Vehicle type  case 1', async () => {
		vehicleTypeActionsServMock.registerVehicleType.and.returnValue(of({ name: 'vh1' }));

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();

		component.vehicleType.name = 'name1';
		component.vehicleType.description = 'desc1';
		component.vehicleType.costPerKm = 40;
		component.vehicleType.currency = 'EUR';
		component.vehicleType.autonomy = 10;
		component.vehicleType.averageConsumption = 11;
		component.vehicleType.averageSpeed = 12;
		component.vehicleType.fuelType = 'gasoline';

		//submit
		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Vehicle Type Created Sucessfully ');
		expect(component.errorMessage).toBeUndefined();
	});

	it('Should Not create a Vehicle type error  case 1 (error comes from service)', async () => {
		vehicleTypeActionsServMock.registerVehicleType.and.returnValue(throwError({ error: 'err1' }));

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
		
		component.vehicleType.name = 'name1';
		component.vehicleType.description = 'desc1';
		component.vehicleType.costPerKm = 40;
		component.vehicleType.currency = 'EUR';
		component.vehicleType.autonomy = 10;
		component.vehicleType.averageConsumption = 11;
		component.vehicleType.averageSpeed = 12;
		component.vehicleType.fuelType = 'gasoline';

		//submit
		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.errorMessage).toEqual('err1');
		expect(component.successMessage).toBeUndefined();
	});
});
