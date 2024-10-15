import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';

import { of, throwError } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { UserRegistrationComponent } from '../../registrations/user-registration/user-registration.component';
import { registerUserActionsService } from 'src/app/core/services/user-actions/registerUser-actions.service';
import { RegisterUserMapperService } from 'src/app/core/services/user-actions/mappers/registerUserMapper.service';

describe('Register-User-Integration', () => {
	let httpClientSpy;

	let Nservice: registerUserActionsService;

	let fixture: ComponentFixture<UserRegistrationComponent>;
	let component: UserRegistrationComponent;

	let testBed;

	//Init the component
	beforeEach(async () => {
		localStorage.clear();
		httpClientSpy = jasmine.createSpyObj('http', [ 'post', 'get' ]);

		let userMapperService = new RegisterUserMapperService();
		Nservice = new registerUserActionsService(httpClientSpy as any, userMapperService);

		testBed = await TestBed.configureTestingModule({
			declarations: [ UserRegistrationComponent ],
			providers: [ { provide: registerUserActionsService, useValue: Nservice } ],
			imports: [ FormsModule, AppRoutingModule ]
		}).compileComponents();
	});

	it('New User should be registered ', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(UserRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.userPrototype.email = 'email@gmail.com';
		component.userPrototype.name = 'sname1';
		component.userPrototype.city = 'city';
		component.userPrototype.street = 'street';
		component.userPrototype.country = 'country';
		component.userPrototype.dateOfBirth = '1993-07-10';
		component.userPrototype.password = 'password123';

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toBeDefined();
	});
	it('New User should not be registered error case 1 ', () => {
		// service method to register user throws an error
		//Mock the values

		httpClientSpy.post.and.returnValue(throwError({ error: 'error' }));

		//Refresh the mocks values
		fixture = TestBed.createComponent(UserRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.userPrototype.email = 'email@gmail.com';
		component.userPrototype.name = 'sname1';
		component.userPrototype.city = 'city';
		component.userPrototype.street = 'street';
		component.userPrototype.country = 'country';
		component.userPrototype.dateOfBirth = '1993-07-10';
		component.userPrototype.password = 'password123';

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toBeDefined();
	});

	it('New User should not be registered error case 2', () => {
		// email is not defined
		//Mock the values
		httpClientSpy.get.and.returnValue(of([]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(UserRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.userPrototype.name = 'sname1';
		component.userPrototype.city = 'city';
		component.userPrototype.street = 'street';
		component.userPrototype.country = 'country';
		component.userPrototype.dateOfBirth = '1993-07-10';
		component.userPrototype.password = 'password123';

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toBeDefined();
	});

	it('New User should not be registered error case 2', () => {
		// name is not defined
		//Mock the values
		httpClientSpy.get.and.returnValue(of([]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(UserRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.userPrototype.email = 'email@gmail.com';
		component.userPrototype.city = 'city';
		component.userPrototype.street = 'street';
		component.userPrototype.country = 'country';
		component.userPrototype.dateOfBirth = '1993-07-10';
		component.userPrototype.password = 'password123';

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toBeDefined();
	});
	it('New User should not be registered error case 2', () => {
		// city is not defined
		//Mock the values
		httpClientSpy.get.and.returnValue(of([]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(UserRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.userPrototype.name = 'sname1';
		component.userPrototype.email = 'email@gmail.com';

		component.userPrototype.street = 'street';
		component.userPrototype.country = 'country';
		component.userPrototype.dateOfBirth = '1993-07-10';
		component.userPrototype.password = 'password123';

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toBeDefined();
	});

	it('New User should not be registered error case 2', () => {
		// street is not defined
		//Mock the values
		httpClientSpy.get.and.returnValue(of([]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(UserRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.userPrototype.name = 'sname1';
		component.userPrototype.email = 'email@gmail.com';
		component.userPrototype.city = 'city';
		component.userPrototype.country = 'country';
		component.userPrototype.dateOfBirth = '1993-07-10';
		component.userPrototype.password = 'password123';

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toBeDefined();
	});

	it('New User should not be registered error case 2', () => {
		// dateOfBirth is not defined
		//Mock the values
		httpClientSpy.get.and.returnValue(of([]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(UserRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.userPrototype.name = 'sname1';
		component.userPrototype.email = 'email@gmail.com';
		component.userPrototype.city = 'city';
		component.userPrototype.country = 'country';

		component.userPrototype.password = 'password123';

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toBeDefined();
	});

	it('New User should not be registered error case 2', () => {
		// password is not defined
		//Mock the values
		httpClientSpy.get.and.returnValue(of([]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(UserRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.userPrototype.name = 'sname1';
		component.userPrototype.email = 'email@gmail.com';
		component.userPrototype.city = 'city';
		component.userPrototype.country = 'country';
		component.userPrototype.dateOfBirth = '1993-07-10';

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toBeDefined();
	});
});
