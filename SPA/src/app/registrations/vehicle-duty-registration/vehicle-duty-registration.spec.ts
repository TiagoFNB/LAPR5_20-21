import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, NgForm } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of, throwError } from "rxjs";
import { AppRoutingModule } from "src/app/app-routing.module";
import { VehicleActionsService } from "src/app/core/services/vehicle-actions/vehicle-actions.service";
import { VehicleDutyActionsService } from "src/app/core/services/vehicleDuty-actions/vehicle-duty-actions.service";
import { VehicleDutyRegistrationComponent } from "./vehicle-duty-registration.component";

describe('VehicleDutyRegistrationComponent', () => {
    let component: VehicleDutyRegistrationComponent;
    let fixture: ComponentFixture<VehicleDutyRegistrationComponent>;
   
  
    let vehicleDutyServMock = jasmine.createSpyObj(VehicleDutyActionsService,['registerVehicleDuty']);
    let vehicleServMock = jasmine.createSpyObj(VehicleActionsService,['getVehicles']);
    let testbed;
  
    beforeEach(async () => {
      testbed=await TestBed.configureTestingModule({
        declarations: [ VehicleDutyRegistrationComponent ],
        providers:[{provide:VehicleActionsService, useValue: vehicleServMock},
          {provide:VehicleDutyActionsService, useValue: vehicleDutyServMock}],
        imports: [
                  FormsModule,
                  AppRoutingModule,
                  MatSelectModule,
                  BrowserModule,
          BrowserAnimationsModule,
          MatGridListModule,
                  MatInputModule,
                  MatFormFieldModule,

              ]
      })
      .compileComponents();
    });
  
   
  
    it('should create', () => {
       vehicleServMock.getVehicles.and.returnValue(of([{code:'x',license:'AA-01-AA'},{code:'B',license:'AB-01-AA'}]));
          vehicleDutyServMock.registerVehicleDuty.and.returnValue(of({VehicleDutyCode:'DUTY1',VehicleLicense:'AA-01-AA'}));
          
      fixture = TestBed.createComponent(VehicleDutyRegistrationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });
  
    it('create a Vehicle success case 1', async () => {
          vehicleServMock.getVehicles.and.returnValue(of([{code:'x',license:'AA-01-AA'},{code:'B',license:'AB-01-AA'}]));
          vehicleDutyServMock.registerVehicleDuty.and.returnValue(of({VehicleDutyCode:'DUTY1',VehicleLicense:'AA-01-AA'}));
          //Refresh the mocks values
          fixture = TestBed.createComponent(VehicleDutyRegistrationComponent);
          component = fixture.componentInstance;
  
          fixture.detectChanges();
  
  
      component.vehicleDuty.code = 'DUTY1';
      component.vehicleDuty.vehicleLicense = 'AA-01-AA';
     
  
          //submit
          component.onSubmit(new NgForm(undefined, undefined));
  
          expect(component.successMessage).toEqual('VehicleDuty was successfully registered.');
          expect(component.errorMessage).toBeUndefined();
      });
  
      it('create a Vehicle Duty error  case 1 (error comes from service)', async () => {
               vehicleServMock.getVehicles.and.returnValue(of([{code:'x',license:'AA-01-AA'},{code:'B',license:'AB-01-AA'}]));
          vehicleDutyServMock.registerVehicleDuty.and.returnValue(throwError({ error: 'err1' }));
          
          //Refresh the mocks values
          fixture = TestBed.createComponent(VehicleDutyRegistrationComponent);
          component = fixture.componentInstance;
  
          fixture.detectChanges();
  
  
          component.vehicleDuty.code = 'DUTY1';
         component.vehicleDuty.vehicleLicense = 'AA-01-AA';
  
  
          //submit
          component.onSubmit(new NgForm(undefined, undefined));
          expect(component.errorMessage).toEqual('err1');
          expect(component.successMessage).toBeUndefined();
    });
    
    it('Should not create Vehicle : obtain a list returns an error', () => {
          //Mock creations
          
          vehicleServMock.getVehicles.and.returnValue(throwError({ error: 'err1' }));
          vehicleDutyServMock.registerVehicleDuty.and.returnValue(throwError({ error: 'err1' }));
          
          //Refresh the mocks values
          fixture = TestBed.createComponent(VehicleDutyRegistrationComponent);
          component = fixture.componentInstance;
  
          fixture.detectChanges();
  
  
   
  
      
      
      
          expect(component.vehicles).toEqual([ 'Error obtaining vehicles.' ]);
          
  
      component.onSubmit(new NgForm(undefined, undefined));
          expect(component.errorMessage).toEqual('err1');
          expect(component.successMessage).toBeUndefined();
      });
  
  
  
  });