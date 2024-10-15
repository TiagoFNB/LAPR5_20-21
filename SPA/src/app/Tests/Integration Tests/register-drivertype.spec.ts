import { DriverTypeActionsService } from './../../core/services/driverType-actions/driver-type-actions.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverTypeRegistrationComponent } from '../../registrations/driver-type-registration/driver-type-registration.component';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';
import { DriverType } from 'src/app/shared/models/DriverType/DriverType';

describe('DriverTypeRegistration Integration Tests', () => {
  let component: DriverTypeRegistrationComponent;
  let fixture: ComponentFixture<DriverTypeRegistrationComponent>;
  let httpClientSpy;

  let driverTypeServ : DriverTypeActionsService;
  let testbed;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', [ 'post', 'get' ]);

    driverTypeServ = new DriverTypeActionsService(httpClientSpy as any);
});

  beforeEach(async () => {
    testbed=await TestBed.configureTestingModule({
      declarations: [ DriverTypeRegistrationComponent ],
      providers: [{ provide: DriverTypeActionsService, useValue: driverTypeServ}],
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

  

	it('create a Driver Type success case 1', async () => {
        
        const expectedDT: DriverType = {
            name: 'name1',
            description: 'desc1',
          };
         
          httpClientSpy.post.and.returnValue(of(expectedDT)); 

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

	it('create a Driver Type error  case 1 (name is required)', async () => {
		

		//Refresh the mocks values
		fixture = TestBed.createComponent(DriverTypeRegistrationComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();


		
		component.driverType.description = 'desc1';


		//submit
		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.errMessage).toEqual('Name is required');
		
    });

    
    it('create a Driver Type error  case 2 (desc is required)', async () => {
		

		//Refresh the mocks values
		fixture = TestBed.createComponent(DriverTypeRegistrationComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();


		
		component.driverType.name = 'name1';


		//submit
		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.errMessage).toEqual('Description is required');
		
    });
    
    it('create a Driver Type error  case  (name is longer than 20 chars)', async () => {
		

		//Refresh the mocks values
		fixture = TestBed.createComponent(DriverTypeRegistrationComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();


		component.driverType.name='name1name2name3name4name5'
		component.driverType.description = 'desc1';


		//submit
		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.errMessage).toEqual('Name is too long');
		
    });

    it('create a Driver Type error  case  (description is longer than 250 chars)', async () => {
		

		//Refresh the mocks values
		fixture = TestBed.createComponent(DriverTypeRegistrationComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();


		component.driverType.name='name1'
		component.driverType.description = 'd'.repeat(251);


		//submit
		component.onSubmit(new NgForm(undefined, undefined));
		expect(component.errMessage).toEqual('Description is too long');
		
    });
});
