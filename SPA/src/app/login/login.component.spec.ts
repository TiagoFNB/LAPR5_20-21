import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { throwError } from 'rxjs';

import { of } from 'rxjs/internal/observable/of';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { AuthenticationService } from 'src/app/core/services/authentication-actions/authentication.service';

import { LoginComponent } from './login.component';

describe('UserLoginComponent', () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;

	let testBed;

	//Create service mocks

	let AActionsServMock = jasmine.createSpyObj(AuthenticationService, [ 'login', 'logout' ]);

	//nodeActionsServMock.getNodesByNames.and.returnValue(of([]));
	beforeEach(async () => {
		testBed = await TestBed.configureTestingModule({
			declarations: [ LoginComponent ],
			providers: [ { provide: AuthenticationService, useValue: AActionsServMock } ],
			imports: [
				FormsModule,
				AppRoutingModule,
				ColorPickerModule,
				MatSelectModule,
				BrowserModule,
				BrowserAnimationsModule,
				ReactiveFormsModule
			]
		}).compileComponents();
	});

	it('component should be created', () => {
		//Refresh the mocks values

		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		expect(component).toBeTruthy();
	});

	it('Should login a User', async () => {
		AActionsServMock.login.and.returnValue(of({ name: 'Name1' }));

		//Refresh the mocks values
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
		component.loginForm.controls['Email'].setValue('test@test.com');
		component.loginForm.controls['Password'].setValue('password');

		//submit
		component.onSubmit();

		expect(component.successMessage).toBe('');
	});

	it('Should not login a User error case1', async () => {
		// services throws an error
		AActionsServMock.login.and.returnValue(throwError({ error: 'error' }));

		//Refresh the mocks values
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
		component.loginForm.controls['Email'].setValue('test@test.com');
		component.loginForm.controls['Password'].setValue('password');

		//submit
		component.onSubmit();

		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toBeDefined();
	});

	it('Should not login a User error case2', async () => {
		// password is not defined
		AActionsServMock.login.and.returnValue(of({ user: 'username' }));

		//Refresh the mocks values
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
		component.loginForm.controls['Email'].setValue('test@test.com');
		component.loginForm.controls['Password'].setValue('');

		//submit
		component.onSubmit();

		expect(component.successMessage).toBeUndefined();
	});

	it('Should not login a User error case3', async () => {
		// email is not defined
		AActionsServMock.login.and.returnValue(of({ user: 'username' }));

		//Refresh the mocks values
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
		component.loginForm.controls['Email'].setValue('');
		component.loginForm.controls['Password'].setValue('passwordd');

		//submit
		component.onSubmit();

		expect(component.successMessage).toBeUndefined();
	});

	it('Should not login a User error case4', async () => {
		// email is not in valid format
		AActionsServMock.login.and.returnValue(of({ user: 'username' }));

		//Refresh the mocks values
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
		component.loginForm.controls['Email'].setValue('email.com');
		component.loginForm.controls['Password'].setValue('passwordd');

		//submit
		component.onSubmit();

		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toBeDefined();
	});
});
