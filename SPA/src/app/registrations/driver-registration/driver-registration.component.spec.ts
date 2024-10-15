import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, NgForm } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of, throwError } from "rxjs";
import { AppRoutingModule } from "src/app/app-routing.module";
import { DriverActionsService } from "src/app/core/services/driver-actions/driver-actions.service";
import { DriverTypeActionsService } from "src/app/core/services/driverType-actions/driver-type-actions.service";
import { DriverRegistrationComponent } from "./driver-registration.component";

describe('driverRegistrationComponent', () => {
    let component: DriverRegistrationComponent;
    let fixture: ComponentFixture<DriverRegistrationComponent>;
   
  
    let driverServMock = jasmine.createSpyObj(DriverActionsService,['registerDriver']);
    let driverTypeServMock = jasmine.createSpyObj(DriverTypeActionsService,['getDriverTypes']);
    let testbed;
  
    beforeEach(async () => {
      testbed=await TestBed.configureTestingModule({
        declarations: [ DriverRegistrationComponent ],
        providers:[{provide:DriverActionsService, useValue: driverServMock},
          {provide:DriverTypeActionsService, useValue: driverTypeServMock}],
        imports: [
                  FormsModule,
                  AppRoutingModule,
                  MatSelectModule,
                  BrowserModule,
          BrowserAnimationsModule,
          MatGridListModule,
                  MatInputModule,
                  MatFormFieldModule,
                  MatDatepickerModule,
                  MatNativeDateModule,
              ]
      })
      .compileComponents();
    });
  
   
  
    it('should create', () => {
      driverServMock.registerDriver.and.returnValue(of({ name: 'dt1' }));
      driverTypeServMock.getDriverTypes.and.returnValue(of([{ name: 'dt1' },{ name: 'dt2' }]));
      fixture = TestBed.createComponent(DriverRegistrationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });
  
    it('create a driver success case 1', async () => {
          driverServMock.registerDriver.and.returnValue
          (of({ mechanographicNumber: "0123456789",
          name: "string",
          birthDate: "02/20/2000",
          citizenCardNumber: "12345678",
          entryDate: "01/01/2020",
          departureDate:"01/02/2020",
          fiscalNumber: "123456789",
          type:"type1",
          license:"X",
          licenseDate:"01/02/2020"}));
          driverTypeServMock.getDriverTypes.and.returnValue(of([{name:'type1'}]));
          //Refresh the mocks values
          fixture = TestBed.createComponent(DriverRegistrationComponent);
          component = fixture.componentInstance;
  
          fixture.detectChanges();
  
  
      component.driver.license = 'X';
      component.driver.type = 'type1';
      component.driver.name='string';
      component.driver.mechanographicNumber='0123456789';
      component.driver.licenseDate=new Date();
      component.driver.birthDate=new Date('02/20/2000');
      component.driver.citizenCardNumber='12345678';
      component.driver.departureDate=new Date('01/02/2020');
      component.driver.entryDate=new Date('01/01/2020');
      component.driver.fiscalNumber="123456789";


  
          //submit
          component.onSubmit(new NgForm(undefined, undefined));
  
          expect(component.successMessage).toEqual('Driver was successfully registered.');
          expect(component.errorMessage).toBeUndefined();
      });
  
      it('create a driver error  case 1 (error comes from service)', async () => {
          driverServMock.registerDriver.and.returnValue(throwError({ error: 'err1' }));
      driverTypeServMock.getDriverTypes.and.returnValue(of([]));
  
          //Refresh the mocks values
          fixture = TestBed.createComponent(DriverRegistrationComponent);
          component = fixture.componentInstance;
  
          fixture.detectChanges();
  
  
          component.driver.license = 'X';
      component.driver.type = 'type1';
      component.driver.name='string';
      component.driver.mechanographicNumber='0123456789';
      component.driver.licenseDate=new Date();
      component.driver.birthDate=new Date('02/20/2000');
      component.driver.citizenCardNumber='12345678';
      component.driver.departureDate=new Date('01/02/2020');
      component.driver.entryDate=new Date('01/01/2020');
      component.driver.fiscalNumber="123456789";
  
  
          //submit
          component.onSubmit(new NgForm(undefined, undefined));
          expect(component.errorMessage).toEqual('err1');
          expect(component.successMessage).toBeUndefined();
    });
    
    it('Should not create driver : obtain a list returns an error', () => {
          //Mock creations
          
          driverTypeServMock.getDriverTypes.and.returnValue(throwError({ error: 'err1' }));
      driverServMock.registerDriver.and.returnValue(throwError({ error: 'err1' }));
  
  
          
  
          //Refresh the mocks values
          fixture = TestBed.createComponent(DriverRegistrationComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
  
  
          //Check if all values are correctly initialized after ngOnInit
      
  
      
      
      
          expect(component.driverTypes).toEqual([ 'Error obtaining driver types.' ]);
          
  
      component.onSubmit(new NgForm(undefined, undefined));
          expect(component.errorMessage).toEqual('err1');
          expect(component.successMessage).toBeUndefined();
      });
  
  
  
  });