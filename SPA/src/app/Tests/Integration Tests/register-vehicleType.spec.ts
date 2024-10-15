import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';

import { of, throwError } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { VehicleTypeRegistrationComponent } from '../../registrations/vehicle-type-registration/vehicle-type-registration.component';
import { VehicleTypeActionsService } from 'src/app/core/services/vehicleType-actions/vehicle-type-actions.service';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('Register-VehicleType-Integration', () => {
	let httpClientSpy;

	let Vservice: VehicleTypeActionsService;

	let fixture: ComponentFixture<VehicleTypeRegistrationComponent>;
	let component: VehicleTypeRegistrationComponent;

	let testBed;

	beforeEach(() => {
		httpClientSpy = jasmine.createSpyObj('HttpClient', [ 'post', 'get' ]);

		Vservice = new VehicleTypeActionsService(httpClientSpy as any);
	});

	//Init the component
	beforeEach(async () => {
		testBed = await TestBed.configureTestingModule({
			declarations: [ VehicleTypeRegistrationComponent ],
			providers: [ { provide: VehicleTypeActionsService, useValue: Vservice } ],
			imports: [ FormsModule, AppRoutingModule, MatSelectModule, BrowserAnimationsModule, NoopAnimationsModule ]
		}).compileComponents();
	});

	it('New Vehicle type should be registered with all fields defined', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([]));
		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				description: 'd1',
				currency: 'EUR',
				fuelType: 'gasoline',
				costPerKm: 40,
				averageSpeed: 39,
				averageConsumption: 27,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: 'd1', //n
			fuelType: 'gpl',
			costPerKm: 40,
			currency: 'EUR', //n
			averageSpeed: 39,
			averageConsumption: 27,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Vehicle Type Created Sucessfully ');
	});

	it('New Vehicle type should be registered with only necessary fields defined', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				fuelType: 'gasoline',
				costPerKm: 40,
				averageSpeed: 39,
				averageConsumption: 27,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: 'gasoline',
			costPerKm: 40,
			currency: undefined,
			averageSpeed: 39,
			averageConsumption: 27,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Vehicle Type Created Sucessfully ');
	});

	it('New Vehicle type should be registered with only necessary fields defined and with fuel type as diesel', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				fuelType: 'diesel',
				costPerKm: 40,
				averageSpeed: 39,
				averageConsumption: 27,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: 'diesel',
			costPerKm: 40,
			currency: undefined,
			averageSpeed: 39,
			averageConsumption: 27,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Vehicle Type Created Sucessfully ');
	});

	it('New Vehicle type should be registered with only necessary fields defined and with fuel type as electric', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				fuelType: 'electric',
				costPerKm: 40,
				averageSpeed: 39,
				averageConsumption: 27,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: 'electric',
			costPerKm: 40,
			currency: undefined,
			averageSpeed: 39,
			averageConsumption: 27,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Vehicle Type Created Sucessfully ');
	});

	it('New Vehicle type should be registered with only necessary fields defined and with fuel type as hydrogen', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				fuelType: 'hydrogen',
				costPerKm: 40,
				averageSpeed: 39,
				averageConsumption: 27,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: 'hydrogen',
			costPerKm: 40,
			currency: undefined,
			averageSpeed: 39,
			averageConsumption: 27,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Vehicle Type Created Sucessfully ');
	});

	it('New Vehicle type should be registered with currency as USD', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				currency: 'USD',
				fuelType: 'hydrogen',
				costPerKm: 40,
				averageSpeed: 39,
				averageConsumption: 27,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: 'hydrogen',
			costPerKm: 40,
			currency: 'USD',
			averageSpeed: 39,
			averageConsumption: 27,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Vehicle Type Created Sucessfully ');
	});

	it('New Vehicle type should be registered with currency as GBP', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				currency: 'GBP',
				fuelType: 'hydrogen',
				costPerKm: 40,
				averageSpeed: 39,
				averageConsumption: 27,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: 'hydrogen',
			costPerKm: 40,
			currency: 'GBP',
			averageSpeed: 39,
			averageConsumption: 27,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Vehicle Type Created Sucessfully ');
	});

	it('New Vehicle type should be registered with currency as BRL', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				currency: 'BRL',
				fuelType: 'hydrogen',
				costPerKm: 40,
				averageSpeed: 39,
				averageConsumption: 27,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: 'hydrogen',
			costPerKm: 40,
			currency: 'BRL',
			averageSpeed: 39,
			averageConsumption: 27,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Vehicle Type Created Sucessfully ');
	});

	it('New Vehicle type should not be registered becouse currency is not valid', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				currency: 'invalidCurrency',
				fuelType: 'hydrogen',
				costPerKm: 40,
				averageSpeed: 39,
				averageConsumption: 27,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: 'invalidCurrency',
			costPerKm: 40,
			currency: 'BRL',
			averageSpeed: 39,
			averageConsumption: 27,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toEqual('Fuel type must be one of those: diesel,electric,gasoline,gpl,hydrogen');
	});

	it('New Vehicle type should not be registered becouse name is not valid', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'i',
				currency: 'USD',
				fuelType: 'hydrogen',
				costPerKm: 40,
				averageSpeed: 39,
				averageConsumption: 27,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'i',
			description: undefined,
			fuelType: 'invalidCurrency',
			costPerKm: 40,
			currency: 'USD',
			averageSpeed: 39,
			averageConsumption: 27,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toEqual('Name length must be between 2 and 20 characters');
	});

	it('New Vehicle type should not be registered becouse name is undefined', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: undefined,
				currency: 'USD',
				fuelType: 'hydrogen',
				costPerKm: 40,
				averageSpeed: 39,
				averageConsumption: 27,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: undefined,
			description: undefined,
			fuelType: 'invalidCurrency',
			costPerKm: 40,
			currency: 'USD',
			averageSpeed: 39,
			averageConsumption: 27,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toEqual('Name must be specified');
	});

	it('New Vehicle type should not be registered becouse fueltype is not valid', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				currency: 'USD',
				fuelType: 'invalidfueltype',
				costPerKm: 40,
				averageSpeed: 39,
				averageConsumption: 27,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: 'invalidfueltype',
			costPerKm: 40,
			currency: 'USD',
			averageSpeed: 39,
			averageConsumption: 27,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toEqual('Fuel type must be one of those: diesel,electric,gasoline,gpl,hydrogen');
	});

	it('New Vehicle type should not be registered becouse fuelType is undefined', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				currency: 'USD',
				fuelType: undefined,
				costPerKm: 40,
				averageSpeed: 39,
				averageConsumption: 27,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: undefined,
			costPerKm: 40,
			currency: 'USD',
			averageSpeed: 39,
			averageConsumption: 27,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toEqual('Fuel type must be specified');
	});

	it('New Vehicle type should not be registered becouse costPerKm is not valid', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				currency: 'USD',
				fuelType: 'gpl',
				costPerKm: 0.001,
				averageSpeed: 39,
				averageConsumption: 27,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: 'gpl',
			costPerKm: 0.001,
			currency: 'USD',
			averageSpeed: 39,
			averageConsumption: 27,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toEqual('Cost Per Km value is too low, check it again please');
	});

	it('New Vehicle type should not be registered becouse costPerKm is undefined', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				currency: 'USD',
				fuelType: 'gpl',
				costPerKm: undefined,
				averageSpeed: 39,
				averageConsumption: 27,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: 'gpl',
			costPerKm: undefined,
			currency: 'USD',
			averageSpeed: 39,
			averageConsumption: 27,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toEqual('Cost Per Km must be specified');
	});

	it('New Vehicle type should not be registered becouse averageSpeed is not valid', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				currency: 'USD',
				fuelType: 'gpl',
				costPerKm: 2,
				averageSpeed: 0.001,
				averageConsumption: 27,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: 'gpl',
			costPerKm: 2,
			currency: 'USD',
			averageSpeed: 0.001,
			averageConsumption: 27,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toEqual('Average Speed value is too low, check it again please');
	});

	it('New Vehicle type should not be registered becouse costPerKm is undefined', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				currency: 'USD',
				fuelType: 'gpl',
				costPerKm: 2,
				averageSpeed: undefined,
				averageConsumption: 27,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: 'gpl',
			costPerKm: 2,
			currency: 'USD',
			averageSpeed: undefined,
			averageConsumption: 27,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toEqual('Average Speed must be specified');
	});

	it('New Vehicle type should not be registered becouse averageSpeed is not valid', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				currency: 'USD',
				fuelType: 'gpl',
				costPerKm: 2,
				averageSpeed: 2,
				averageConsumption: 0.001,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: 'gpl',
			costPerKm: 2,
			currency: 'USD',
			averageSpeed: 2,
			averageConsumption: 0.001,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toEqual('average Consumption value is too low, check it again please');
	});

	it('New Vehicle type should not be registered becouse averageConsumption is undefined', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				currency: 'USD',
				fuelType: 'gpl',
				costPerKm: 2,
				averageSpeed: 3,
				averageConsumption: undefined,
				autonomy: 30
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: 'gpl',
			costPerKm: 2,
			currency: 'USD',
			averageSpeed: 2,
			averageConsumption: undefined,
			autonomy: 30
		};

		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toEqual('average Consumption must be specified');
	});

	it('New Vehicle type should not be registered becouse autonomy is not valid', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				currency: 'USD',
				fuelType: 'gpl',
				costPerKm: 2,
				averageSpeed: 2,
				averageConsumption: 3,
				autonomy: 0.001
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: 'gpl',
			costPerKm: 2,
			currency: 'USD',
			averageSpeed: 2,
			averageConsumption: 3,
			autonomy: 0.001
		};

		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toEqual('Autonomy value is too low, check it again please');
	});

	it('New Vehicle type should not be registered becouse autonomy is undefined', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				currency: 'USD',
				fuelType: 'gpl',
				costPerKm: 2,
				averageSpeed: 3,
				averageConsumption: 3,
				autonomy: undefined
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: undefined,
			fuelType: 'gpl',
			costPerKm: 2,
			currency: 'USD',
			averageSpeed: 2,
			averageConsumption: 3,
			autonomy: undefined
		};

		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toEqual('Autonomy must be specified');
	});

	it('New Vehicle type should not be registered becouse description is too big ', () => {
		//generate a big string to test description validation
		let x = 'desc';
		var iterations = 4;
		for (var i = 0; i < iterations; i++) {
			x += x + x;
		}

		//Mock the values

		httpClientSpy.post.and.returnValue(
			of({
				name: 'it1',
				currency: 'USD',
				fuelType: 'gpl',
				costPerKm: 2,
				averageSpeed: 3,
				averageConsumption: 3,
				autonomy: 4,
				description: x
			})
		);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: x,
			fuelType: 'gpl',
			costPerKm: 2,
			currency: 'USD',
			averageSpeed: 2,
			averageConsumption: 3,
			autonomy: 4
		};

		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toEqual('Description length must be between 250 characters maximum');
	});

	it('New Vehicle type should not be registered becouse spa cant connect backed server ', () => {
		//Mock the values

		let eerr = new Error('proxy');
		httpClientSpy.post.and.throwError(eerr);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: 'desc',
			fuelType: 'gpl',
			costPerKm: 2,
			currency: 'USD',
			averageSpeed: 2,
			averageConsumption: 3,
			autonomy: 4
		};

		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toEqual('Error: could not connect to backend server');
	});

	it('New Vehicle type should not be registered becouse of duplicate key ', () => {
		//Mock the values

		let eerr = new Error('E11000 duplicate');
		httpClientSpy.post.and.throwError(eerr);

		//Refresh the mocks values
		fixture = TestBed.createComponent(VehicleTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.vehicleType = {
			name: 'it1',
			description: 'desc',
			fuelType: 'gpl',
			costPerKm: 2,
			currency: 'USD',
			averageSpeed: 2,
			averageConsumption: 3,
			autonomy: 4
		};

		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toEqual('Error: That vehicle type already exists in the system');
	});
});
