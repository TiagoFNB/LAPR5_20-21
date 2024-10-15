import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs/internal/observable/of';

import { TripRegistrationComponent } from './trip-registration.component';
import { TripActionsService } from '../../core/services/trip-actions/trip-actions.service'
import { LineActionsService } from '../../core/services/line-actions/line-actions.service'
import { FormsModule, NgForm } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { BrowserModule } from '@angular/platform-browser';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { throwError } from 'rxjs';

describe('TripRegistrationComponent', () => {
  let component: TripRegistrationComponent;
  let fixture: ComponentFixture<TripRegistrationComponent>;

  let tripActionsServMock = jasmine.createSpyObj(TripActionsService, ['registerTrip', 'handleErrors'] )
  let lineActionsServMock = jasmine.createSpyObj(LineActionsService, ['getListLines', 'getPathsFromLine']);

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [TripRegistrationComponent],
      providers: [{
        provide: LineActionsService, useValue: lineActionsServMock},
      {provide: TripActionsService, useValue: tripActionsServMock}],
      imports: [
        FormsModule,
        NoopAnimationsModule,
        AppRoutingModule,
        MatSelectModule,
        NgxMaterialTimepickerModule,
        MatSelectModule,
        HttpClientModule,
        FormsModule,
        AppRoutingModule,
        ColorPickerModule,
        MatSelectModule,
        BrowserModule,
        BrowserAnimationsModule,
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

  it('should create component', () => {
    tripActionsServMock.registerTrip.and.returnValue(of({ PathId: 'pathTest1' }));
    lineActionsServMock.getListLines.and.returnValue(of([{}]));
    lineActionsServMock.getPathsFromLine.and.returnValue(of([{}]));

    fixture = TestBed.createComponent(TripRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('Should create a Trip case 1', async () => {
    tripActionsServMock.registerTrip.and.returnValue(of([]));
    lineActionsServMock.getListLines.and.returnValue(of([{}]));
    lineActionsServMock.getPathsFromLine.and.returnValue(of([{ paths: [{key:'pathTest1'}] }]));

    //Refresh the mocks values
    fixture = TestBed.createComponent(TripRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let trip = {
      pathId: undefined,
      lineId: undefined,
      startingTime: undefined,
      endingTime: undefined,
      frequency: undefined
    };

    //Check if all values are correctly initialized after ngOnInit
    expect(component.requestTrip.pathId).toEqual(trip.pathId);
    expect(component.requestTrip.lineId).toEqual(trip.lineId);
    expect(component.lines.length).toEqual(1);

    component.requestTrip.pathId = "pathTest1",

    //submit
    component.onSubmit(new NgForm(undefined, undefined));

    expect(component.successMessage).toEqual('Trip created sucessfully');
    expect(component.errorMessage).toBeUndefined();
  });

  it('Should create more than one Trip case 1', async () => {
    tripActionsServMock.registerTrip.and.returnValue(of([]));
    lineActionsServMock.getListLines.and.returnValue(of([{}]));
    lineActionsServMock.getPathsFromLine.and.returnValue(of([{ paths: [{key:'pathTest1'}] }]));

    //Refresh the mocks values
    fixture = TestBed.createComponent(TripRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let trip = {
      pathId: undefined,
      lineId: undefined,
      startingTime: undefined,
      endingTime: undefined,
      frequency: undefined
    };

    //Check if all values are correctly initialized after ngOnInit
    expect(component.requestTrip.pathId).toEqual(trip.pathId);
    expect(component.requestTrip.lineId).toEqual(trip.lineId);
    expect(component.lines.length).toEqual(1);

    component.requestTrip.frequency = "00:39";
    component.requestTrip.endingTime = "00:39";

    //submit
    component.onSubmit(new NgForm(undefined, undefined));

    expect(component.successMessage).toEqual('Trips created sucessfully');
    expect(component.errorMessage).toBeUndefined();
  });
  
  it('Should not create a Trip, throws error', async () => {
    tripActionsServMock.registerTrip.and.returnValue(throwError({error:'err1'}));
    lineActionsServMock.getListLines.and.returnValue(of([{}]));
    lineActionsServMock.getPathsFromLine.and.returnValue(of([{ paths: [{key:'pathTest1'}] }]));

    //Refresh the mocks values
    fixture = TestBed.createComponent(TripRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let trip = {
      pathId: undefined,
      lineId: undefined,
      startingTime: undefined,
      endingTime: undefined,
      frequency: undefined
    };

    //Check if all values are correctly initialized after ngOnInit
    expect(component.requestTrip.pathId).toEqual(trip.pathId);
    expect(component.requestTrip.lineId).toEqual(trip.lineId);
    expect(component.lines.length).toEqual(1);

    component.requestTrip.pathId = "pathTest1",

    //submit
    component.onSubmit(new NgForm(undefined, undefined));

    expect(component.errorMessage).toEqual('err1');
    expect(component.successMessage).toBeUndefined();
  });
});
