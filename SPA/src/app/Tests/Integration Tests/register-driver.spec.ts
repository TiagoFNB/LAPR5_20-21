import { DriverRegistrationComponent } from './../../registrations/driver-registration/driver-registration.component';
import { DriverTypeActionsService } from './../../core/services/driverType-actions/driver-type-actions.service';
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
import { DriverActionsService } from 'src/app/core/services/driver-actions/driver-actions.service';
import { DriverMapperService } from 'src/app/core/services/driver-actions/mappers/driver-mapper.service';
describe('Register-Driver-Integration', () => {

    let httpClientSpy;
    let Dservice : DriverActionsService;
    let DTservice : DriverTypeActionsService;
    let component : DriverRegistrationComponent;
    let fixture: ComponentFixture<DriverRegistrationComponent>;

    let testBed; 

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post','get']);
        Dservice = new DriverActionsService(httpClientSpy as any, new DriverMapperService());
        DTservice = new DriverTypeActionsService(httpClientSpy as any);
      });

      //Init the component
    beforeEach(async () => {
        testBed = await TestBed.configureTestingModule({declarations:[DriverRegistrationComponent],providers:[
          { provide: DriverActionsService, useValue: Dservice },
          {provide: DriverTypeActionsService, useValue: DTservice}], 
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

      it('New Driver should be registered', () => {
        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(of(''));

        //Refresh the mocks values
        fixture = TestBed.createComponent(DriverRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
       

        component.driver.license = 'X';
      component.driver.type = 'type1';
      component.driver.name='string';
      component.driver.mechanographicNumber='012345678';
      component.driver.licenseDate=new Date();
      component.driver.birthDate=new Date('02/20/2000');
      component.driver.citizenCardNumber='12345678';
      component.driver.departureDate=new Date('01/02/2020');
      component.driver.entryDate=new Date('01/01/2020');
      component.driver.fiscalNumber="123456789";

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.successMessage).toEqual('Driver was successfully registered.');
      });

      it('New Driver should not be registered: An element is undefined', () => {
        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(of(''));

        //Refresh the mocks values
        fixture = TestBed.createComponent(DriverRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
       

        
        component.driver.license = 'X';
        component.driver.type = 'type1';
        component.driver.name='string';
        
        component.driver.licenseDate=new Date();
        component.driver.birthDate=new Date('02/20/2000');
        component.driver.citizenCardNumber='12345678';
        component.driver.departureDate=new Date('01/02/2020');
        component.driver.entryDate=new Date('01/01/2020');
        component.driver.fiscalNumber="123456789";

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual('Mechanographic Number is required');
      });


      it('New Driver should not be registered: An element  is incorrect', () => {
        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(of(''));

        //Refresh the mocks values
        fixture = TestBed.createComponent(DriverRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        component.driver.license = 'X';
      component.driver.type = 'type1';
      component.driver.name='string';
      component.driver.mechanographicNumber='012345678';
      component.driver.licenseDate=new Date();
      component.driver.birthDate=new Date('02/20/2000');
      component.driver.citizenCardNumber='12345678';
      component.driver.departureDate=new Date('01/02/2020');
      component.driver.entryDate=new Date('01/01/2020');
      component.driver.fiscalNumber="12345678955";

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual('Fiscal Number is in invalid format');
      });

      it('New Driver should not be registered: Error comes from the database', () => {
        let expError = new HttpErrorResponse({error:"Test error"});

        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(throwError(expError));

        //Refresh the mocks values
        fixture = TestBed.createComponent(DriverRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        component.driver.license = 'X';
      component.driver.type = 'type1';
      component.driver.name='string';
      component.driver.mechanographicNumber='012345678';
      component.driver.licenseDate=new Date();
      component.driver.birthDate=new Date('02/20/2000');
      component.driver.citizenCardNumber='12345678';
      component.driver.departureDate=new Date('01/02/2020');
      component.driver.entryDate=new Date('01/01/2020');
      component.driver.fiscalNumber="123456789";

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual('Test error');
      });

      it('New Driver should not be registered: Error comes from the database 2', () => {
        let expError = new HttpErrorResponse({error:"E11000 duplicate"});

        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(throwError(expError));

        //Refresh the mocks values
        fixture = TestBed.createComponent(DriverRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        component.driver.license = 'X';
      component.driver.type = 'type1';
      component.driver.name='string';
      component.driver.mechanographicNumber='012345678';
      component.driver.licenseDate=new Date();
      component.driver.birthDate=new Date('02/20/2000');
      component.driver.citizenCardNumber='12345678';
      component.driver.departureDate=new Date('01/02/2020');
      component.driver.entryDate=new Date('01/01/2020');
      component.driver.fiscalNumber="123456789";

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual('Error: That driver already exists in the system');
      });


     

});