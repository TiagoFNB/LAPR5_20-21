import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { LineActionsService } from 'src/app/core/services/line-actions/line-actions.service';
import { ObtainTripsMapperService } from 'src/app/core/services/trip-actions/mappers/obtainTripsMapper';
import { TripActionsService } from 'src/app/core/services/trip-actions/trip-actions.service';
import { WorkblockActionsService } from 'src/app/core/services/workblock-actions/workblock-actions.service';
import { Line } from 'src/app/shared/models/Line/Line';

import { WorkblockRegistrationComponent } from './workblock-registration.component';

describe('WorkblockRegistrationComponent', () => {
    let component: WorkblockRegistrationComponent;
    let fixture: ComponentFixture<WorkblockRegistrationComponent>;
   
  
    let workblockServMock = jasmine.createSpyObj(WorkblockActionsService,['registerWorkBlocksOfVehicleService']);
    let tripServMock = jasmine.createSpyObj(TripActionsService,['obtainTripsOfLine']);
    let lineServMock = jasmine.createSpyObj(LineActionsService,['getListLinesByName']);
    let tripMapperMock = jasmine.createSpyObj(ObtainTripsMapperService,['mapFromMDVToView']);


    let testbed;
  
    beforeEach(async () => {
      testbed=await TestBed.configureTestingModule({
        declarations: [ WorkblockRegistrationComponent ],
        providers:[{provide: WorkblockActionsService, useValue: workblockServMock},
          {provide:TripActionsService, useValue: tripServMock},
          {provide:LineActionsService, useValue: lineServMock},
          {provide:ObtainTripsMapperService, useValue: tripMapperMock}],
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
  
   
  
    it('should be created', () => {
      workblockServMock.registerWorkBlocksOfVehicleService.and.returnValue(of({wks: [{driverDutyCode:null,endDate:'12/29/2020',
      endTime:'02:05:00',startDate:'12/29/2020',startTime:'02:00:00',trips:['testTrip1'],vehicleDutyCode:'VeicDutT01'}]}));
          
      let tripsList : any[] = [];
      tripsList.push({key: "TestTrip01",pathId: "TestPath01",passingTimes:[0,1]});

      tripServMock.obtainTripsOfLine.and.returnValue(of(tripsList));

      let lineList : Line[] = [];
      lineList.push(new Line("TestLine01","TestNameLine01",{red:0,blue:0,green:0},"a","a",[],[]));

      lineServMock.getListLinesByName.and.returnValue(of(lineList));        

      tripMapperMock.mapFromMDVToView.and.returnValue(of(lineList));

      fixture = TestBed.createComponent(WorkblockRegistrationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });
  
    it('create a Workblock success case 1', async () => {
      workblockServMock.registerWorkBlocksOfVehicleService.and.returnValue(of({wks: [{driverDutyCode:null,endDate:'12/29/2020',
      endTime:'02:05:00',startDate:'12/29/2020',startTime:'02:00:00',trips:['testTrip1'],vehicleDutyCode:'VeicDutT01'}]}));
          
      let tripsList : any[] = [];
      tripsList.push({key: "TestTrip01",pathId: "TestPath01",passingTimes:[0,1]});

      tripServMock.obtainTripsOfLine.and.returnValue(of(tripsList));

      let lineList : Line[] = [];
      lineList.push(new Line("TestLine01","TestNameLine01",{red:0,blue:0,green:0},"a","a",[],[]));

      lineServMock.getListLinesByName.and.returnValue(of(lineList));        

      tripMapperMock.mapFromMDVToView.and.returnValue(of(lineList));

      fixture = TestBed.createComponent(WorkblockRegistrationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  
      //Before settings values
      expect(component.successMessage).toBeUndefined();
      expect(component.errorMessage).toBeUndefined();
      expect(component.loadingSubmit).toEqual(false);
      expect(component.loadingSearch).toEqual(false);
      expect(component.obtainedTrips).toEqual([]);
      expect(component.currentLine).toBeUndefined();
      expect(component.lineList).toBeUndefined();

      expect(component.workblock.vehicleServiceId).toBeUndefined();
      expect(component.workblock.time).toBeUndefined();
      expect(component.workblock.amountBlocks).toBeUndefined();
      expect(component.workblock.durationBlocks).toBeUndefined();
      expect(component.workblock.selectedTrips).toEqual([]);
  
      //Fill in the fields
      component.workblock.vehicleServiceId = 'VeicDutT01';
      component.workblock.time = '1/30/2030T02:00:00';
      component.workblock.amountBlocks = 2;
      component.workblock.durationBlocks = "2:00";
      component.workblock.selectedTrips = [];

      //submit
      component.onSubmit(new NgForm(undefined, undefined));
  
        expect(component.successMessage).toEqual("Created " + 1 + " workblocks successfully.");
        expect(component.errorMessage).toBeUndefined();
      });

      it('create a Workblock failure case 1 : Error response', async () => {
        let ExpectedErr = new Error('Expected Error Message.');
        Object.defineProperty(ExpectedErr, 'error', {
            value: "Expected Error Message."
          });

        workblockServMock.registerWorkBlocksOfVehicleService.and.returnValue(throwError(ExpectedErr));
            
        let tripsList : any[] = [];
        tripsList.push({key: "TestTrip01",pathId: "TestPath01",passingTimes:[0,1]});
  
        tripServMock.obtainTripsOfLine.and.returnValue(of(tripsList));
  
        let lineList : Line[] = [];
        lineList.push(new Line("TestLine01","TestNameLine01",{red:0,blue:0,green:0},"a","a",[],[]));
  
        lineServMock.getListLinesByName.and.returnValue(of(lineList));        
  
        tripMapperMock.mapFromMDVToView.and.returnValue(of(lineList));
  
        fixture = TestBed.createComponent(WorkblockRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        //Before settings values
        expect(component.successMessage).toBeUndefined();
        expect(component.errorMessage).toBeUndefined();
        expect(component.loadingSubmit).toEqual(false);
        expect(component.loadingSearch).toEqual(false);
        expect(component.obtainedTrips).toEqual([]);
        expect(component.currentLine).toBeUndefined();
        expect(component.lineList).toBeUndefined();
  
        expect(component.workblock.vehicleServiceId).toBeUndefined();
        expect(component.workblock.time).toBeUndefined();
        expect(component.workblock.amountBlocks).toBeUndefined();
        expect(component.workblock.durationBlocks).toBeUndefined();
        expect(component.workblock.selectedTrips).toEqual([]);
    
        //Fill in the fields
        component.workblock.vehicleServiceId = 'VeicDutT01';
        component.workblock.time = '1/30/2030T02:00:00';
        component.workblock.amountBlocks = 2;
        component.workblock.durationBlocks = "2:00";
        component.workblock.selectedTrips = [];
  
          //submit
          component.onSubmit(new NgForm(undefined, undefined));
    
          expect(component.successMessage).toBeUndefined();
          expect(component.errorMessage).toEqual("Expected Error Message.");
        });

        it('create a Workblock failure case 1 : Error in register function', async () => {
          let ExpectedErr = new Error('Expected Error Message.');
          Object.defineProperty(ExpectedErr, 'error', {
              value: "Expected Error Message."
            });
  
          workblockServMock.registerWorkBlocksOfVehicleService.and.throwError(ExpectedErr);
              
          let tripsList : any[] = [];
          tripsList.push({key: "TestTrip01",pathId: "TestPath01",passingTimes:[0,1]});
    
          tripServMock.obtainTripsOfLine.and.returnValue(of(tripsList));
    
          let lineList : Line[] = [];
          lineList.push(new Line("TestLine01","TestNameLine01",{red:0,blue:0,green:0},"a","a",[],[]));
    
          lineServMock.getListLinesByName.and.returnValue(of(lineList));        
    
          tripMapperMock.mapFromMDVToView.and.returnValue(of(lineList));
    
          fixture = TestBed.createComponent(WorkblockRegistrationComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
      
          //Before settings values
          expect(component.successMessage).toBeUndefined();
          expect(component.errorMessage).toBeUndefined();
          expect(component.loadingSubmit).toEqual(false);
          expect(component.loadingSearch).toEqual(false);
          expect(component.obtainedTrips).toEqual([]);
          expect(component.currentLine).toBeUndefined();
          expect(component.lineList).toBeUndefined();
    
          expect(component.workblock.vehicleServiceId).toBeUndefined();
          expect(component.workblock.time).toBeUndefined();
          expect(component.workblock.amountBlocks).toBeUndefined();
          expect(component.workblock.durationBlocks).toBeUndefined();
          expect(component.workblock.selectedTrips).toEqual([]);
      
          //Fill in the fields
          component.workblock.vehicleServiceId = 'VeicDutT01';
          component.workblock.time = '1/30/2030T02:00:00';
          component.workblock.amountBlocks = 2;
          component.workblock.durationBlocks = "2:00";
          component.workblock.selectedTrips = [];
    
            //submit
            component.onSubmit(new NgForm(undefined, undefined));
      
            expect(component.successMessage).toBeUndefined();
            expect(component.errorMessage).toEqual("Expected Error Message.");
          });
});
