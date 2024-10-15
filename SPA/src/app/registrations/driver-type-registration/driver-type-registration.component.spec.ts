import { DriverTypeActionsService } from './../../core/services/driverType-actions/driver-type-actions.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverTypeRegistrationComponent } from './driver-type-registration.component';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';

describe('DriverTypeRegistrationComponent', () => {
  let component: DriverTypeRegistrationComponent;
  let fixture: ComponentFixture<DriverTypeRegistrationComponent>;

  let driverTypeServMock = jasmine.createSpyObj(DriverTypeActionsService,['registerDriverType']);
  let testbed;


  beforeEach(async () => {
    testbed=await TestBed.configureTestingModule({
      declarations: [ DriverTypeRegistrationComponent ],
      providers: [{ provide: DriverTypeActionsService, useValue: driverTypeServMock}],
      imports: [
				FormsModule,
				AppRoutingModule,
				ColorPickerModule,
				MatSelectModule,
				BrowserModule,
				BrowserAnimationsModule
			]
    })
    .compileComponents();
  });

  it('component should be created', () => {
		
		fixture = TestBed.createComponent(DriverTypeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		expect(component).toBeTruthy();
	});

	it('create a Driver Type success case 1', async () => {
		driverTypeServMock.registerDriverType.and.returnValue(of({ name: 'dt1' }));

		//Refresh the mocks values
		fixture = TestBed.createComponent(DriverTypeRegistrationComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();


		component.driverType.name = 'name1';
		component.driverType.description = 'desc1';

		//submit
		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Creation of DriverType successful');
		expect(component.errMessage).toBeUndefined();
	});

	it('create a Driver Type error  case 1 (error comes from service)', async () => {
		driverTypeServMock.registerDriverType.and.returnValue(throwError({ error: 'err1' }));

		//Refresh the mocks values
		fixture = TestBed.createComponent(DriverTypeRegistrationComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();


		component.driverType.name = 'name1';
		component.driverType.description = 'desc1';


		//submit
		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.errMessage).toEqual('err1');
		expect(component.successMessage).toBeUndefined();
	});
});
