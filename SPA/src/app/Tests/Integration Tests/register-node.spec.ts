import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';

import { of, throwError } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { NodeRegistrationComponent } from '../../registrations/node-registration/node-registration.component';
import { NodeServiceService } from 'src/app/core/services/node-service.service';

describe('Register-Node-Integration', () => {
	let httpClientSpy;

	let Nservice: NodeServiceService;

	let fixture: ComponentFixture<NodeRegistrationComponent>;
	let component: NodeRegistrationComponent;

	let testBed;

	beforeEach(() => {
		httpClientSpy = jasmine.createSpyObj('HttpClient', [ 'post', 'get' ]);

		Nservice = new NodeServiceService(httpClientSpy as any);
	});

	//Init the component
	beforeEach(async () => {
		testBed = await TestBed.configureTestingModule({
			declarations: [ NodeRegistrationComponent ],
			providers: [ { provide: NodeServiceService, useValue: Nservice } ],
			imports: [ FormsModule, AppRoutingModule ]
		}).compileComponents();
	});

	it('New Node should be registered with all fields defined', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.node.name = 'node1';
		component.node.shortName = 'sh1';
		component.node.isDepot = 'true';
		component.node.isReliefPoint = 'false';
		component.node.latitude = 30;
		component.node.longitude = 29;
		component.node.crewTravelTimes = 30;
		component.node.crewTravelTimeReferenceNode = 'node2';

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Node Created Sucessfully ');
	});

	it('New Node should be registered with even without defining crew travel time reference node while crew travel time duration is specified (it assumes it is itself)', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.node.name = 'node1';
		component.node.shortName = 'sh1';
		component.node.isDepot = 'true';
		component.node.isReliefPoint = 'false';
		component.node.latitude = 30;
		component.node.longitude = 29;
		component.node.crewTravelTimes = 30;

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Node Created Sucessfully ');
	});

	it('New Node should be registered with only required fields  defined', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.node.name = 'node1';
		component.node.shortName = 'sh1';
		component.node.isDepot = 'false';
		component.node.isReliefPoint = 'false';
		component.node.latitude = 30;
		component.node.longitude = 29;

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Node Created Sucessfully ');
	});

	it('New Node should Not be registered becouse of shortName not defined', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.node.name = 'node1';

		component.node.isDepot = 'false';
		component.node.isReliefPoint = 'false';
		component.node.latitude = 30;
		component.node.longitude = 29;

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.errorMessage).toEqual('ShortName is required');
	});

	it('New Node should Not be registered becouse of name not defined', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.node.shortName = 'sh1';
		component.node.isDepot = 'false';
		component.node.isReliefPoint = 'false';
		component.node.latitude = 30;
		component.node.longitude = 29;

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.errorMessage).toEqual('Name is required');
	});

	it('New Node should Not be registered becouse of latitude is invalid', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.node.name = 'node1';
		component.node.shortName = 'sh1';
		component.node.isDepot = 'true';
		component.node.isReliefPoint = 'true';
		component.node.latitude = 100;
		component.node.longitude = 29;

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.errorMessage).toEqual(
			'check value of coordinates, -90< latitude >90   and -180< longitude >180'
		);
	});

	it('New Node should Not be registered becouse of longitude is invalid', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.node.name = 'node1';
		component.node.shortName = 'sh1';
		component.node.isDepot = 'true';
		component.node.isReliefPoint = 'true';
		component.node.latitude = 17;
		component.node.longitude = 190;

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.errorMessage).toEqual(
			'check value of coordinates, -90< latitude >90   and -180< longitude >180'
		);
	});

	it('New Node should Not be registered becouse crew travel time reference node is specified but vrew travel time duration is not', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.node.name = 'node1';
		component.node.shortName = 'sh1';
		component.node.isDepot = 'true';
		component.node.isReliefPoint = 'true';
		component.node.latitude = 17;
		component.node.longitude = 90;

		component.node.crewTravelTimeReferenceNode = 'node2';

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.errorMessage).toEqual(
			'An unexpected error happened, check the required fields and if you specify a reference node dont forget to specify the duration'
		);
	});

	// it('New Line should not be registered: An element is undefined', () => {
	// 	//Mock the values
	// 	httpClientSpy.get.and.returnValue(of([]));
	// 	httpClientSpy.post.and.returnValue(of(''));

	// 	//Refresh the mocks values
	// 	fixture = TestBed.createComponent(LineRegistrationComponent);
	// 	component = fixture.componentInstance;
	// 	fixture.detectChanges();

	// 	component.line.key = 'B';
	// 	component.line.terminalNode1 = 'nA';
	// 	component.line.terminalNode2 = 'nB';

	// 	component.onSubmit(new NgForm(undefined, undefined));

	// 	expect(component.errorMessage).toEqual('One of the fields was not filled.');
	// });

	// it('New Line should not be registered: RGB format is incorrect', () => {
	// 	//Mock the values
	// 	httpClientSpy.get.and.returnValue(of([]));
	// 	httpClientSpy.post.and.returnValue(of(''));

	// 	//Refresh the mocks values
	// 	fixture = TestBed.createComponent(LineRegistrationComponent);
	// 	component = fixture.componentInstance;
	// 	fixture.detectChanges();

	// 	component.line.key = 'B';
	// 	component.line.name = 'B';
	// 	component.unformattedRGB = 'RGB(256,0,0)';
	// 	component.line.terminalNode1 = 'nA';
	// 	component.line.terminalNode2 = 'nB';

	// 	component.onSubmit(new NgForm(undefined, undefined));

	// 	expect(component.errorMessage).toEqual('The Color format is incorrect.');
	// });

	// it('New Line should not be registered: Error comes from the database', () => {
	// 	let expError = new HttpErrorResponse({ error: 'Test error' });

	// 	//Mock the values
	// 	httpClientSpy.get.and.returnValue(of([]));
	// 	httpClientSpy.post.and.returnValue(throwError(expError));

	// 	//Refresh the mocks values
	// 	fixture = TestBed.createComponent(LineRegistrationComponent);
	// 	component = fixture.componentInstance;
	// 	fixture.detectChanges();

	// 	component.line.key = 'B';
	// 	component.line.name = 'B';
	// 	component.line.terminalNode1 = 'nA';
	// 	component.line.terminalNode2 = 'nB';

	// 	component.onSubmit(new NgForm(undefined, undefined));

	// 	expect(component.errorMessage).toEqual('Test error');
	// });

	// it('New Line should not be registered: Error comes from the database 2', () => {
	// 	let expError = new HttpErrorResponse({ error: 'E11000 duplicate' });

	// 	//Mock the values
	// 	httpClientSpy.get.and.returnValue(of([]));
	// 	httpClientSpy.post.and.returnValue(throwError(expError));

	// 	//Refresh the mocks values
	// 	fixture = TestBed.createComponent(LineRegistrationComponent);
	// 	component = fixture.componentInstance;
	// 	fixture.detectChanges();

	// 	component.line.key = 'B';
	// 	component.line.name = 'B';
	// 	component.line.terminalNode1 = 'nA';
	// 	component.line.terminalNode2 = 'nB';

	// 	component.onSubmit(new NgForm(undefined, undefined));

	// 	expect(component.errorMessage).toEqual('Submitted line code already exists.');
	// });

	// it('New Line should not be registered: Error comes from the database 3', () => {
	// 	let expError = new HttpErrorResponse({
	// 		error: 'child "code" fails because ["code" must only contain alpha-numeric characters]'
	// 	});

	// 	//Mock the values
	// 	httpClientSpy.get.and.returnValue(of([]));
	// 	httpClientSpy.post.and.returnValue(throwError(expError));

	// 	//Refresh the mocks values
	// 	fixture = TestBed.createComponent(LineRegistrationComponent);
	// 	component = fixture.componentInstance;
	// 	fixture.detectChanges();

	// 	component.line.key = 'B';
	// 	component.line.name = 'B';
	// 	component.line.terminalNode1 = 'nA';
	// 	component.line.terminalNode2 = 'nB';

	// 	component.onSubmit(new NgForm(undefined, undefined));

	// 	expect(component.errorMessage).toEqual('Code must only contain alpha-numeric characters.');
	// });
});
