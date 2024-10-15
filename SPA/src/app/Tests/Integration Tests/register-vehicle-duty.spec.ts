import { VehicleDutyMapperService } from './../../core/services/vehicleDuty-actions/mappers/vehicle-duty-mapper.service';
import { VehicleDutyRegistrationComponent } from './../../registrations/vehicle-duty-registration/vehicle-duty-registration.component';
import { VehicleActionsService } from './../../core/services/vehicle-actions/vehicle-actions.service';
import { VehicleDutyActionsService } from './../../core/services/vehicleDuty-actions/vehicle-duty-actions.service';
import { VehicleMapperService } from 'src/app/core/services/vehicle-actions/mappers/VehicleMapper.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';
describe('Register-Vehicle-Integration', () => {

    let httpClientSpy;
    let VDservice : VehicleDutyActionsService;
    let Vservice : VehicleActionsService;
    let component : VehicleDutyRegistrationComponent;
    let fixture: ComponentFixture<VehicleDutyRegistrationComponent>;

    let testBed; 

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post','get']);
        VDservice = new VehicleDutyActionsService(httpClientSpy as any, new VehicleDutyMapperService());
        Vservice = new VehicleActionsService(httpClientSpy as any, new VehicleMapperService());
      });

      //Init the component
    beforeEach(async () => {
        testBed = await TestBed.configureTestingModule({declarations:[VehicleDutyRegistrationComponent],providers:[
          { provide: VehicleDutyActionsService, useValue: VDservice },
          {provide: VehicleActionsService, useValue: Vservice}], 
          imports: [FormsModule,
            AppRoutingModule,
            MatSelectModule,
            BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
            MatInputModule,
            MatFormFieldModule,
            MatDatepickerModule,
            MatNativeDateModule,]
        }).compileComponents();
      });

      it('New Vehicle should be registered', () => {
        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(of(''));

        //Refresh the mocks values
        fixture = TestBed.createComponent(VehicleDutyRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
       

        component.vehicleDuty.code = '0123456789';
      component.vehicleDuty.vehicleLicense = 'AA-01-AA';

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.successMessage).toEqual('VehicleDuty was successfully registered.');
      });

      it('New Vehicle should not be registered: An element is undefined', () => {
        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(of(''));

        //Refresh the mocks values
        fixture = TestBed.createComponent(VehicleDutyRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
       

        
        
        component.vehicleDuty.vehicleLicense = 'AA-01-AA';

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual('Code is required');
      });


      it('New Vehicle should not be registered: An element  is incorrect', () => {
        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(of(''));

        //Refresh the mocks values
        fixture = TestBed.createComponent(VehicleDutyRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        component.vehicleDuty.code = 'DUTY1';
      component.vehicleDuty.vehicleLicense = 'AA-01-AA';

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual('Code must be 10 characters long');
      });

      it('New Vehicle should not be registered: Error comes from the database', () => {
        let expError = new HttpErrorResponse({error:"Test error"});

        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(throwError(expError));

        //Refresh the mocks values
        fixture = TestBed.createComponent(VehicleDutyRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        component.vehicleDuty.code = '0123456789';
      component.vehicleDuty.vehicleLicense = 'AA-01-AA';

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual('Test error');
      });

      it('New Vehicle should not be registered: Error comes from the database 2', () => {
        let expError = new HttpErrorResponse({error:"E11000 duplicate"});

        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(throwError(expError));

        //Refresh the mocks values
        fixture = TestBed.createComponent(VehicleDutyRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        component.vehicleDuty.code = '0123456789';
      component.vehicleDuty.vehicleLicense = 'AA-01-AA';

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual('Error: That vehicle duty already exists in the system');
      });


     

});