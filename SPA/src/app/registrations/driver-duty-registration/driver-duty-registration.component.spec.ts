import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, NgForm } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ColorPickerModule } from "ngx-color-picker";
import { of, throwError } from "rxjs";
import { AppRoutingModule } from "src/app/app-routing.module";
import { DriverActionsService } from "src/app/core/services/driver-actions/driver-actions.service";
import { DriverDutyActionsService } from "src/app/core/services/driverDuty-actions/driver-duty-actions.service";
import { DriverDutyRegistrationComponent } from "./driver-duty-registration.component";

describe('DriverDutyRegistrationComponent', () => {
	let component: DriverDutyRegistrationComponent;
	let fixture: ComponentFixture<DriverDutyRegistrationComponent>;

	let testBed;

	//Create service mocks
	let driverActionsServMock = jasmine.createSpyObj(DriverActionsService, [ 'getDriverWithStartingId' ]);
	let driverDutyActionsServMock = jasmine.createSpyObj(DriverDutyActionsService, [ 'registerDriverDuty' ]);

	//nodeActionsServMock.getNodesByNames.and.returnValue(of([]));
	beforeEach(async () => {
		testBed = await TestBed.configureTestingModule({
			declarations: [ DriverDutyRegistrationComponent ],
			providers: [
				{ provide: DriverActionsService, useValue: driverActionsServMock },
				{ provide: DriverDutyActionsService, useValue: driverDutyActionsServMock },
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
		driverActionsServMock.getDriverWithStartingId.and.returnValue(of([]));
		driverDutyActionsServMock.registerDriverDuty.and.returnValue(of(null));

		//Refresh the mocks values
		fixture = TestBed.createComponent(DriverDutyRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		expect(component).toBeTruthy();
    });
    
    it('Should not create DriverDuty : error obtaining driver mecanographic codes', () => {
        //Mock creations
        let ExpectedErr = new Error('Expected Error Message.');
        Object.defineProperty(ExpectedErr, 'error', {
            value: "Expected Error Message."
          });

		driverActionsServMock.getDriverWithStartingId.and.returnValue(throwError(ExpectedErr));
		driverDutyActionsServMock.registerDriverDuty.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(DriverDutyRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		let initDriverDuty = {
			code: undefined,
		    driverCode: undefined
		};

		//Check if all values are correctly initialized after ngOnInit
        expect(component.driverDuty).toEqual(initDriverDuty);
        expect(component.loading).toEqual(false);

        //simulates a keyup event
        component.driverDuty.driverCode = "a";
		component.driverCodesInDB();

		expect(component.errorMessage).toEqual('Expected Error Message.');
    });

    it('Should not create DriverDuty : driverduty with said code already exists', () => {
        //Mock creations
        let ExpectedErr = new Error('Expected Error Message.');
        Object.defineProperty(ExpectedErr, 'error', {
            value: "Expected Error Message."
          });

		driverActionsServMock.getDriverWithStartingId.and.returnValue(of([]));
		driverDutyActionsServMock.registerDriverDuty.and.returnValue(throwError(ExpectedErr));

		//Refresh the mocks values
		fixture = TestBed.createComponent(DriverDutyRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		let initDriverDuty = {
			code: undefined,
		    driverCode: undefined
		};

		//Check if all values are correctly initialized after ngOnInit
        expect(component.driverDuty).toEqual(initDriverDuty);
        expect(component.loading).toEqual(false);

        //simulates a keyup event
        component.driverDuty.driverCode = "a";
		component.driverCodesInDB();

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.errorMessage).toEqual('Expected Error Message.');
    });
    
    it('Should create DriverDuty', () => {
		//Mock creations
		driverActionsServMock.getDriverWithStartingId.and.returnValue(of([]));
		driverDutyActionsServMock.registerDriverDuty.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(DriverDutyRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		let initDriverDuty = {
			code: undefined,
		    driverCode: undefined
		};

		//Check if all values are correctly initialized after ngOnInit
        expect(component.driverDuty).toEqual(initDriverDuty);
        expect(component.loading).toEqual(false);

		//simulates a keyup event
		component.driverCodesInDB();
		expect(component.driverList).toEqual([]);

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Driver Duty was successfully registered.');
	});
});