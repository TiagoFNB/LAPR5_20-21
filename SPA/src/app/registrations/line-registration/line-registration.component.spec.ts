import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { throwError } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { DriverTypeActionsService } from 'src/app/core/services/driverType-actions/driver-type-actions.service';
import { LineActionsService } from 'src/app/core/services/line-actions/line-actions.service';
import { NodeServiceService } from 'src/app/core/services/node-service.service';
import { VehicleTypeActionsService } from 'src/app/core/services/vehicleType-actions/vehicle-type-actions.service';
import { LineRegistrationComponent } from './line-registration.component';

describe('LineRegistrationComponent', () => {
	let component: LineRegistrationComponent;
	let fixture: ComponentFixture<LineRegistrationComponent>;

	let testBed;

	//Create service mocks
	let lineActionsServMock = jasmine.createSpyObj(LineActionsService, [ 'registerLine' ]);
	let vehicleTypeActionsServMock = jasmine.createSpyObj(VehicleTypeActionsService, [ 'getVehicleTypes' ]);
	let driverTypeActionsServMock = jasmine.createSpyObj(DriverTypeActionsService, [ 'getDriverTypes' ]);
	let nodeActionsServMock = jasmine.createSpyObj(NodeServiceService, [ 'getNodesByNames' ]);

	//nodeActionsServMock.getNodesByNames.and.returnValue(of([]));
	beforeEach(async () => {
		testBed = await TestBed.configureTestingModule({
			declarations: [ LineRegistrationComponent ],
			providers: [
				{ provide: LineActionsService, useValue: lineActionsServMock },
				{ provide: VehicleTypeActionsService, useValue: vehicleTypeActionsServMock },
				{ provide: DriverTypeActionsService, useValue: driverTypeActionsServMock },
				{ provide: NodeServiceService, useValue: nodeActionsServMock }
			],
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
		//Mock creations
		driverTypeActionsServMock.getDriverTypes.and.returnValue(of([]));
		vehicleTypeActionsServMock.getVehicleTypes.and.returnValue(of([]));
		nodeActionsServMock.getNodesByNames.and.returnValue(of([]));
		lineActionsServMock.registerLine.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(LineRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		expect(component).toBeTruthy();
	});

	it('Should create Line', () => {
		//Mock creations
		driverTypeActionsServMock.getDriverTypes.and.returnValue(of([]));
		vehicleTypeActionsServMock.getVehicleTypes.and.returnValue(of([]));
		nodeActionsServMock.getNodesByNames.and.returnValue(of([]));
		lineActionsServMock.registerLine.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(LineRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		let initLine = {
			key: undefined,
			name: undefined,
			RGB: {
				red: 0,
				green: 0,
				blue: 0
			},
			terminalNode1: undefined,
			terminalNode2: undefined,
			AllowedDrivers: [],
			AllowedVehicles: []
		};

		//Check if all values are correctly initialized after ngOnInit
		expect(component.line).toEqual(initLine);

		expect(component.vehicleTypes).toEqual([]);
		expect(component.driverTypes).toEqual([]);
		//simulates a keyup event
		component.nodesInDBMethodforTermianlNode1();
		component.nodesInDBMethodforTermianlNode2();
		expect(component.nodesInDB).toEqual([]);
		//
		expect(component.unformattedRGB).toEqual('rgb(0,0,0)');

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Line was successfully registered.');
	});

	it('Should not create Line : obtain a list returns an error, still valid info therefore line is created', () => {
		//Mock creations
		driverTypeActionsServMock.getDriverTypes.and.returnValue(of([]));
		vehicleTypeActionsServMock.getVehicleTypes.and.returnValue(of([]));
		nodeActionsServMock.getNodesByNames.and.returnValue(throwError(''));

		lineActionsServMock.registerLine.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(LineRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		let initLine = {
			key: undefined,
			name: undefined,
			RGB: {
				red: 0,
				green: 0,
				blue: 0
			},
			terminalNode1: undefined,
			terminalNode2: undefined,
			AllowedDrivers: [],
			AllowedVehicles: []
		};

		//Check if all values are correctly initialized after ngOnInit
		expect(component.line).toEqual(initLine);

		expect(component.vehicleTypes).toEqual([]);
		expect(component.driverTypes).toEqual([]);
		//simulates a keyup event
		component.nodesInDBMethodforTermianlNode1();
		component.nodesInDBMethodforTermianlNode2();
		//
		expect(component.nodesInDB).toEqual([ 'Error obtaining nodes.' ]);
		expect(component.unformattedRGB).toEqual('rgb(0,0,0)');

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Line was successfully registered.');
	});

	it('Should not create Line : obtain a list returns an error, invalid info so line is not created', () => {
		//Mock creations
		driverTypeActionsServMock.getDriverTypes.and.returnValue(of([]));
		vehicleTypeActionsServMock.getVehicleTypes.and.returnValue(of([]));
		nodeActionsServMock.getNodesByNames.and.returnValue(throwError(''));

		let ExpectedErr = new Error();
		ExpectedErr.message = 'Expected Error Message.';

		lineActionsServMock.registerLine.and.returnValue(throwError(ExpectedErr));

		//Refresh the mocks values
		fixture = TestBed.createComponent(LineRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		let initLine = {
			key: undefined,
			name: undefined,
			RGB: {
				red: 0,
				green: 0,
				blue: 0
			},
			terminalNode1: undefined,
			terminalNode2: undefined,
			AllowedDrivers: [],
			AllowedVehicles: []
		};

		//Check if all values are correctly initialized after ngOnInit
		expect(component.line).toEqual(initLine);

		expect(component.vehicleTypes).toEqual([]);
		expect(component.driverTypes).toEqual([]);

		//simulates a keyup event
		component.nodesInDBMethodforTermianlNode1();
		component.nodesInDBMethodforTermianlNode2();
		// to test if it is displayed an error
		expect(component.nodesInDB).toEqual([ 'Error obtaining nodes.' ]);
		expect(component.unformattedRGB).toEqual('rgb(0,0,0)');

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.errorMessage).toEqual('Expected Error Message.');
	});
});
