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
import { LineActionsService } from "src/app/core/services/line-actions/line-actions.service";
import { ObtainTripsMapperService } from "src/app/core/services/trip-actions/mappers/obtainTripsMapper";
import { RegisterTripMapperService } from "src/app/core/services/trip-actions/mappers/registerTripMapper";
import { TripActionsService } from "src/app/core/services/trip-actions/trip-actions.service";
import { VehicleMapperService } from 'src/app/core/services/vehicle-actions/mappers/VehicleMapper.service';
import { VehicleActionsService } from "src/app/core/services/vehicle-actions/vehicle-actions.service";
import { VehicleTypeActionsService } from "src/app/core/services/vehicleType-actions/vehicle-type-actions.service";
import { WorkBlockGeneratorMapperService } from "src/app/core/services/workblock-actions/mappers/WorkBlockGeneratorMapperService";
import { WorkblockActionsService } from "src/app/core/services/workblock-actions/workblock-actions.service";
import { VehicleRegistrationComponent } from "src/app/registrations/vehicle-registration/vehicle-registration.component";
import { WorkblockRegistrationComponent } from "src/app/registrations/workblock-registration/workblock-registration.component";

describe('Register-Vehicle-Integration', () => {

    let httpClientSpy;
    let workblockServ : WorkblockActionsService;
    let tripServ : TripActionsService;
    let lineServ : LineActionsService;
    let tripMapper : ObtainTripsMapperService;

    let component: WorkblockRegistrationComponent;
    let fixture: ComponentFixture<WorkblockRegistrationComponent>;
    let testBed; 

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post','get']);
        workblockServ = new WorkblockActionsService(httpClientSpy as any, new WorkBlockGeneratorMapperService());
        tripServ = new TripActionsService(httpClientSpy as any, new RegisterTripMapperService);
        lineServ = new LineActionsService(httpClientSpy as any);
        tripMapper = new ObtainTripsMapperService();
      });

      //Init the component
    beforeEach(async () => {
        testBed = await TestBed.configureTestingModule({declarations:[WorkblockRegistrationComponent],providers:[
          { provide: WorkblockActionsService, useValue: workblockServ },
          {provide: TripActionsService, useValue: tripServ},
          {provide: LineActionsService, useValue: lineServ},
          {provide: ObtainTripsMapperService, useValue: tripMapper}], 
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

      it('New WorkBlocks should be registered', () => {
        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(of({wks : []}));

        //Refresh the mocks values
        fixture = TestBed.createComponent(WorkblockRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
       

        //Fill in the fields
        component.workblock.vehicleServiceId = 'VeicDutT01';
        component.workblock.time = "2030-12-16T10:00";
        component.workblock.amountBlocks = 2;
        component.workblock.durationBlocks = "00:05";
        component.workblock.selectedTrips = [{Id:"testTrip",path:"testPath",departute:"10:00h"}];

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.successMessage).toEqual("Created " + 0 + " workblocks successfully.");
      });

      it('New WorkBlocks should be registered 2', () => {
        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(of({wks : [{Dummy: "dummyHere"}]}));

        //Refresh the mocks values
        fixture = TestBed.createComponent(WorkblockRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
       

        //Fill in the fields
        component.workblock.vehicleServiceId = 'VeicDutT01';
        component.workblock.time = "2030-12-16T10:00";
        component.workblock.amountBlocks = 2;
        component.workblock.durationBlocks = "00:05";
        component.workblock.selectedTrips = [{Id:"testTrip",path:"testPath",departute:"10:00h"}];

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.successMessage).toEqual("Created " + 1 + " workblocks successfully.");
      });

      it('New WorkBlocks should be registered - error response', () => {
        let ExpectedErr = new Error('Expected Error Message.');
          Object.defineProperty(ExpectedErr, 'error', {
              value: "Expected Error Message Internal."
            });

        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(throwError(ExpectedErr));

        //Refresh the mocks values
        fixture = TestBed.createComponent(WorkblockRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
       

        //Fill in the fields
        component.workblock.vehicleServiceId = 'VeicDutT01';
        component.workblock.time = "2030-12-16T10:00";
        component.workblock.amountBlocks = 2;
        component.workblock.durationBlocks = "00:05";
        component.workblock.selectedTrips = [{Id:"testTrip",path:"testPath",departute:"10:00h"}];

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual("Expected Error Message Internal.");
      });

      it('New WorkBlocks should be registered - error response (cant reach the server)', () => {
        let ExpectedErr = new Error(' Unknown Error');
          Object.defineProperty(ExpectedErr, 'error', {
              value: "Expected Error Message Internal."
            });

        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(throwError(ExpectedErr));

        //Refresh the mocks values
        fixture = TestBed.createComponent(WorkblockRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
       

        //Fill in the fields
        component.workblock.vehicleServiceId = 'VeicDutT01';
        component.workblock.time = "2030-12-16T10:00";
        component.workblock.amountBlocks = 2;
        component.workblock.durationBlocks = "00:05";
        component.workblock.selectedTrips = [{Id:"testTrip",path:"testPath",departute:"10:00h"}];

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual(" Unknown Error");
      });
});