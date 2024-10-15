import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { PathRegistrationComponent } from '../../registrations/path-registration/path-registration.component';
import { PathActionsService } from 'src/app/core/services/path-actions/path-actions.service';
import {LineActionsService} from 'src/app/core/services/line-actions/line-actions.service';
import {NodeServiceService} from 'src/app/core/services/node-service.service'
import { forwardRef } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TripActionsService } from 'src/app/core/services/trip-actions/trip-actions.service';
import { TripRegistrationComponent } from 'src/app/registrations/trip-registration/trip-registration.component';
import { RegisterTripMapperService } from 'src/app/core/services/trip-actions/mappers/registerTripMapper';

describe('Register-Trip-Integration', () => {
	let httpClientSpy;

	let tripService: TripActionsService;
    let lineService: LineActionsService;


	let fixture: ComponentFixture<TripRegistrationComponent>;
	let component: TripRegistrationComponent;
    let lineActionsServMock = jasmine.createSpyObj(lineService, ['getPathsFromLine']);
	let testBed;


	beforeEach(() => {
		httpClientSpy = jasmine.createSpyObj('HttpClient', [ 'post', 'get' ]);
        let mapper = new RegisterTripMapperService(); 
		tripService = new TripActionsService(httpClientSpy as any, mapper);
		lineService = new LineActionsService(httpClientSpy as any);

	});

	//Init the component
	beforeEach(async () => {
		testBed = await TestBed.configureTestingModule({
			declarations: [ TripRegistrationComponent ],
            providers: [ { provide: TripActionsService, useValue: tripService },
                { provide: LineActionsService, useValue: lineService },
				{
					provide: NG_VALUE_ACCESSOR,
					useExisting: forwardRef(() => TripRegistrationComponent),
					multi: true
				  } ],
				  imports: [FormsModule,AppRoutingModule,ColorPickerModule,MatSelectModule,BrowserModule,BrowserAnimationsModule]
		}).compileComponents();
	});

	it('New trip should be registered with all fields defined', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([{key:'pathTest', line:'lineTest01'}]));
		httpClientSpy.post.and.returnValue(of({}));

		//Refresh the mocks values
		fixture = TestBed.createComponent(TripRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
    
		component.requestTrip.pathId = 'pathTest';
		component.requestTrip.lineId = 'lineTest01';
		component.requestTrip.startingTime = "00:05";
	
		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Trip created sucessfully');
	});

	it('New trips should be registered with all fields defined', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([{key:'pathTest', line:'lineTest01'}]));
		httpClientSpy.post.and.returnValue(of({}));

		//Refresh the mocks values
		fixture = TestBed.createComponent(TripRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
    
		component.requestTrip.pathId = 'pathTest';
		component.requestTrip.lineId = 'lineTest01';
		component.requestTrip.startingTime = "00:05";
		component.requestTrip.endingTime = "00:10";
		component.requestTrip.frequency = "00:05"
	
		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Trips created sucessfully');
	});

	it('New trip should be registered even tho multiple trips has wrong values', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([{key:'pathTest', line:'lineTest01'}]));
		httpClientSpy.post.and.returnValue(of({}));

		//Refresh the mocks values
		fixture = TestBed.createComponent(TripRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
    
		component.requestTrip.pathId = 'pathTest';
		component.requestTrip.lineId = 'lineTest01';
		component.requestTrip.startingTime = "00:05";
		component.requestTrip.endingTime = undefined;
		component.requestTrip.frequency = "00:05"
	
		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Trip created sucessfully');
	});

	it('New trip should be registered even tho multiple trips has wrong values', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([{key:'pathTest', line:'lineTest01'}]));
		httpClientSpy.post.and.returnValue(of({}));

		//Refresh the mocks values
		fixture = TestBed.createComponent(TripRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
    
		component.requestTrip.pathId = 'pathTest';
		component.requestTrip.lineId = 'lineTest01';
		component.requestTrip.startingTime = "00:05";
		component.requestTrip.endingTime = "00:10";
		component.requestTrip.frequency = undefined;
	
		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Trip created sucessfully');
	});

	it('New trip should NOT be registered because line is undefined', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([{key:'pathTest', line:'lineTest01'}]));
		httpClientSpy.post.and.returnValue(of({}));

		//Refresh the mocks values
		fixture = TestBed.createComponent(TripRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
    
		component.requestTrip.pathId = 'pathTest';
		component.requestTrip.startingTime = "00:05";
		component.requestTrip.endingTime = "00:10";
		component.requestTrip.frequency = undefined;
	
		component.onSubmit(new NgForm(undefined, undefined));
		fixture.detectChanges();
		expect(component.errorMessage).toEqual('LineId Must be  defined ');
	});

	it('New trip should NOT be registered because path is undefined', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([{key:'pathTest', line:'lineTest01'}]));
		httpClientSpy.post.and.returnValue(of({}));

		//Refresh the mocks values
		fixture = TestBed.createComponent(TripRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
    
		component.requestTrip.lineId = 'lineTest01';
		component.requestTrip.startingTime = "00:05";
	
		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.errorMessage).toEqual('PathId Must be  defined ');
	});

	it('New trip should NOT be registered because starting time is undefined', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([{key:'pathTest', line:'lineTest01'}]));
		httpClientSpy.post.and.returnValue(of({}));

		//Refresh the mocks values
		fixture = TestBed.createComponent(TripRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
    
		component.requestTrip.pathId = 'pathTest';
		component.requestTrip.lineId = 'lineTest01';
	
		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.errorMessage).toEqual('Starting time must be  defined ');
	});

	it('New trip should NOT be registered because starting time is bigger than ending', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([{key:'pathTest', line:'lineTest01'}]));
		httpClientSpy.post.and.returnValue(of({}));

		//Refresh the mocks values
		fixture = TestBed.createComponent(TripRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
    
		component.requestTrip.pathId = 'pathTest';
		component.requestTrip.lineId = 'lineTest01';
		component.requestTrip.startingTime = '00:05';
		component.requestTrip.endingTime = '00:00';
		component.requestTrip.frequency = '00:05';
		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.errorMessage).toEqual('End time cant be lower than starting time');
	});
});
