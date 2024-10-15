import { HttpErrorResponse } from "@angular/common/http";
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
import { VehicleMapperService } from 'src/app/core/services/vehicle-actions/mappers/VehicleMapper.service';
import { VehicleActionsService } from "src/app/core/services/vehicle-actions/vehicle-actions.service";
import { VehicleTypeActionsService } from "src/app/core/services/vehicleType-actions/vehicle-type-actions.service";
import { VehicleRegistrationComponent } from "src/app/registrations/vehicle-registration/vehicle-registration.component";

describe('Register-Vehicle-Integration', () => {

    let httpClientSpy;
    let Vservice : VehicleActionsService;
    let VTservice : VehicleTypeActionsService;
    let component : VehicleRegistrationComponent;
    let fixture: ComponentFixture<VehicleRegistrationComponent>;

    let testBed; 

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post','get']);
        Vservice = new VehicleActionsService(httpClientSpy as any, new VehicleMapperService());
        VTservice = new VehicleTypeActionsService(httpClientSpy as any);
      });

      //Init the component
    beforeEach(async () => {
        testBed = await TestBed.configureTestingModule({declarations:[VehicleRegistrationComponent],providers:[
          { provide: VehicleActionsService, useValue: Vservice },
          {provide: VehicleTypeActionsService, useValue: VTservice}], 
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
        fixture = TestBed.createComponent(VehicleRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
       

        component.vehicle.license = 'AA-01-AA';
    component.vehicle.type = 'TYPE1';
    component.vehicle.entryDateOfService=new Date();
    component.vehicle.vin='12345678901234567'

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.successMessage).toEqual('Vehicle was successfully registered.');
      });

      it('New Vehicle should not be registered: An element is undefined', () => {
        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(of(''));

        //Refresh the mocks values
        fixture = TestBed.createComponent(VehicleRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
       

        
    component.vehicle.type = 'TYPE1';
    component.vehicle.entryDateOfService=new Date();
    component.vehicle.vin='12345678901234567'

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual('License is required');
      });


      it('New Vehicle should not be registered: An element  is incorrect', () => {
        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(of(''));

        //Refresh the mocks values
        fixture = TestBed.createComponent(VehicleRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        component.vehicle.license = 'AA-01asd';
    component.vehicle.type = 'TYPE1';
    component.vehicle.entryDateOfService=new Date();
    component.vehicle.vin='12345678901234567'

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual('License is in invalid format');
      });

      it('New Vehicle should not be registered: Error comes from the database', () => {
        let expError = new HttpErrorResponse({error:"Test error"});

        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(throwError(expError));

        //Refresh the mocks values
        fixture = TestBed.createComponent(VehicleRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        component.vehicle.license = 'AA-01-AA';
        component.vehicle.type = 'TYPE1';
        component.vehicle.entryDateOfService=new Date();
        component.vehicle.vin='12345678901234567'

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual('Test error');
      });

      it('New Vehicle should not be registered: Error comes from the database 2', () => {
        let expError = new HttpErrorResponse({error:"E11000 duplicate"});

        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(throwError(expError));

        //Refresh the mocks values
        fixture = TestBed.createComponent(VehicleRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        component.vehicle.license = 'AA-01-AA';
        component.vehicle.type = 'TYPE1';
        component.vehicle.entryDateOfService=new Date();
        component.vehicle.vin='12345678901234567'

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual('Error: That vehicle already exists in the system');
      });


     

});