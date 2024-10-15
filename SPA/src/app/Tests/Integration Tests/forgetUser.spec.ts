import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';

import { of, throwError } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { UserPanelComponent } from '../../user-panel/user-panel.component';
import { forgetUserActionsService } from 'src/app/core/services/user-actions/ForgetUser-actions.service';
import { AuthenticationService } from 'src/app/core/services/authentication-actions/authentication.service';
import { ForgetUserMapperService } from 'src/app/core/services/user-actions/mappers/forgetUserMapper.service';

describe('Register-User-Integration', () => {
	let httpClientSpy;
	let AuthServiceSpy;

	let Nservice: forgetUserActionsService;
	let fixture: ComponentFixture<UserPanelComponent>;
	let component: UserPanelComponent;

	let testBed;

	//Init the component
	beforeEach(async () => {
		localStorage.clear();
		httpClientSpy = jasmine.createSpyObj('http', [ 'post' ]);
		AuthServiceSpy = jasmine.createSpyObj(AuthenticationService, [ 'logout' ]);

		let userMapperService = new ForgetUserMapperService();
		//mocking http client and AuthenticationService becouse it is already tested
		Nservice = new forgetUserActionsService(httpClientSpy as any, userMapperService, AuthServiceSpy as any);

		testBed = await TestBed.configureTestingModule({
			declarations: [ UserPanelComponent ],
			providers: [ { provide: forgetUserActionsService, useValue: Nservice } ],
			imports: [ FormsModule, AppRoutingModule ]
		}).compileComponents();
	});

	it('Should forget User ', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(UserPanelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.forgetUserPrototype.email = 'email@gmail.com';
		component.forgetUserPrototype.password = 'password123';

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toBeDefined();
		expect(component.errorMessage).toBeUndefined();
	});

	it('Should Not forget User. Invalid Email provided ', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(UserPanelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.forgetUserPrototype.email = 'email';
		component.forgetUserPrototype.password = 'password123';

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toBeDefined();
	});
	it('Should Not forget User. Invalid Password provided. Must be greater then 6 chars', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(UserPanelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.forgetUserPrototype.email = 'email@gmail.com';
		component.forgetUserPrototype.password = 'pas';

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toBeDefined();
	});
	it('Should Not forget User. Error from http (backend) response', () => {
		//Mock the values

		httpClientSpy.post.and.returnValue(throwError({ error: 'error' }));

		//Refresh the mocks values
		fixture = TestBed.createComponent(UserPanelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.forgetUserPrototype.email = 'email@gmail.com';
		component.forgetUserPrototype.password = 'pas';

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toBeUndefined();
		expect(component.errorMessage).toBeDefined();
	});
});
