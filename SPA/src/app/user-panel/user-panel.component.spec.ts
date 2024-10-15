import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { throwError } from 'rxjs';

import { of } from 'rxjs/internal/observable/of';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { forgetUserActionsService } from 'src/app/core/services/user-actions/ForgetUser-actions.service';
import { ForgetUser } from '../shared/models/User/ForgetUser';

import { UserPanelComponent } from './user-panel.component';

describe('UserRegistrationComponent', () => {
	let component: UserPanelComponent;
	let fixture: ComponentFixture<UserPanelComponent>;

	let testBed;

	//Create service mocks

	let AActionsServMock = jasmine.createSpyObj(forgetUserActionsService, [ 'ForgetUser', 'LogOut' ]);

	//nodeActionsServMock.getNodesByNames.and.returnValue(of([]));
	beforeEach(async () => {
		testBed = await TestBed.configureTestingModule({
			declarations: [ UserPanelComponent ],
			providers: [ { provide: forgetUserActionsService, useValue: AActionsServMock } ],
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

		fixture = TestBed.createComponent(UserPanelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		expect(component).toBeTruthy();
	});

	it('Should delete a User', async () => {
		AActionsServMock.ForgetUser.and.returnValue(of({ message: 'deleted' }));
		AActionsServMock.LogOut.and.returnValue(of(true));
		//Refresh the mocks values
		fixture = TestBed.createComponent(UserPanelComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();

		let model: ForgetUser = ForgetUser.Create({ email: 'email@gmail.com', password: 'password123' });
		let x = spyOn(ForgetUser, 'Create').and.returnValue(model);

		//submit

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toBeDefined();
		expect(component.errorMessage).toBeUndefined();
	});

	it('Should not delete a User. Error creating model', async () => {
		AActionsServMock.ForgetUser.and.returnValue(of({ message: 'deleted' }));
		AActionsServMock.LogOut.and.returnValue(of(true));
		//Refresh the mocks values
		fixture = TestBed.createComponent(UserPanelComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();

		let x = spyOn(ForgetUser, 'Create').and.throwError(new Error('error'));

		//submit

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toBeDefined();
	});

	it('Should not delete a User. Error from service model', async () => {
		AActionsServMock.ForgetUser.and.returnValue(of(throwError('err1')));
		AActionsServMock.LogOut.and.returnValue(of(true));
		//Refresh the mocks values
		fixture = TestBed.createComponent(UserPanelComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();

		let model: ForgetUser = ForgetUser.Create({ email: 'email@gmail.com', password: 'password123' });
		let x = spyOn(ForgetUser, 'Create').and.returnValue(model);

		//submit

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toBeDefined();
		expect(component.errorMessage).toBeUndefined();
	});
});
