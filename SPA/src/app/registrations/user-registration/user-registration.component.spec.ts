import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { throwError } from 'rxjs';

import { of } from 'rxjs/internal/observable/of';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { registerUserActionsService } from 'src/app/core/services/user-actions/registerUser-actions.service';

import { UserRegistrationComponent } from './user-registration.component';

describe('UserRegistrationComponent', () => {
	let component: UserRegistrationComponent;
	let fixture: ComponentFixture<UserRegistrationComponent>;

	let testBed;

	//Create service mocks

	let AActionsServMock = jasmine.createSpyObj(registerUserActionsService, [
		'registerUser',
		'verifyIfUserIsAlreadySigned'
	]);

	//nodeActionsServMock.getNodesByNames.and.returnValue(of([]));
	beforeEach(async () => {
		testBed = await TestBed.configureTestingModule({
			declarations: [ UserRegistrationComponent ],
			providers: [ { provide: registerUserActionsService, useValue: AActionsServMock } ],
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

		fixture = TestBed.createComponent(UserRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		expect(component).toBeTruthy();
	});

	it('Should create a User', async () => {
		AActionsServMock.registerUser.and.returnValue(of({ name: 'Name1' }));

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

		//submit
		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toBeDefined();
	});

	it('Should not create a User', async () => {
		// service return an error
		//Mock creations

		AActionsServMock.registerUser.and.returnValue(throwError({ error: 'error 1' }));

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

		//submit
		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toBeDefined();
	});
});
