import { DataSource } from '@angular/cdk/table';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { LineActionsService } from 'src/app/core/services/line-actions/line-actions.service';
import { LineMapperService } from 'src/app/core/services/line-actions/mappers/line-mapper.service';

import { LineListingComponent } from './line-listing.component';

describe('LineListingComponent', () => {
  let component: LineListingComponent;
  let fixture: ComponentFixture<LineListingComponent>;

  let testBed;

  //Create service mocks
	let lineActionsServMock = jasmine.createSpyObj(LineActionsService, [ 'getListLines' ]);
	let lineMapperServMock = jasmine.createSpyObj(LineMapperService, [ 'FromMDVListToViewList' ]);

  beforeEach(async () => {
		testBed = await TestBed.configureTestingModule({
			declarations: [ LineListingComponent ],
			providers: [
				{ provide: LineActionsService, useValue: lineActionsServMock },
				{ provide: LineMapperService, useValue: lineMapperServMock },
			],
			imports: [
				FormsModule,
				AppRoutingModule,
				MatSelectModule,
				BrowserModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatSortModule,
        MatGridListModule,
        MatInputModule,
        MatFormFieldModule,
			]
		}).compileComponents();
	});

  it('component should be created', () => {
		//Mock creations
		lineActionsServMock.getListLines.and.returnValue(of([]));
		lineMapperServMock.FromMDVListToViewList.and.returnValue(of([]));

		//Refresh the mocks values
		fixture = TestBed.createComponent(LineListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		expect(component).toBeTruthy();
  });
  
  it('Should contain 0 lines', () => {
		//Mock creations
		lineActionsServMock.getListLines.and.returnValue(of([]));
		lineMapperServMock.FromMDVListToViewList.and.returnValue(of([]));

		//Refresh the mocks values
		fixture = TestBed.createComponent(LineListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

    let initModel = {code : '', name : '', node: ''};




		//Check if all values are correctly initialized after ngOnInit
		expect(component.inputModel).toEqual(initModel);

    let dt = component.dataSource.data.subscribe(
      (data) => {expect(data.length).toEqual(0);},
      (error) => {fail;}
    );
		
  });
  
  it('Should contain 2 lines', () => {
    let lines = [{code:'code',name:'name',node1:'node1',node2:'node2',allowedDrivers:'allowedDrivers',allowedVehicles:'allowedVehicles',color:'color'},
      {code:'a',name:'a',node1:'a',node2:'a',allowedDrivers:'a',allowedVehicles:'a',color:'#a89732'}
      ];

		//Mock creations
		lineActionsServMock.getListLines.and.returnValue(of([]));
		lineMapperServMock.FromMDVListToViewList.and.returnValue(of(lines));

		//Refresh the mocks values
		fixture = TestBed.createComponent(LineListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

    let initModel = {code : '', name : '', node: ''};




		//Check if all values are correctly initialized after ngOnInit
		expect(component.inputModel).toEqual(initModel);

    let dt = component.dataSource.data.subscribe(
      (data) => {expect(data).toEqual(lines);},
      (error) => {fail;}
    );
		
  });
  
  it('Should give error with the given message', () => {
    let lines = [{code:'code',name:'name',node1:'node1',node2:'node2',allowedDrivers:'allowedDrivers',allowedVehicles:'allowedVehicles',color:'color'},
      {code:'a',name:'a',node1:'a',node2:'a',allowedDrivers:'a',allowedVehicles:'a',color:'#a89732'}
      ];

      let errorMsg = "Custom error message.";
      let givenError = new Error(errorMsg);

		//Mock creations
		lineActionsServMock.getListLines.and.returnValue(throwError(givenError));
		lineMapperServMock.FromMDVListToViewList.and.returnValue(of(lines));

		//Refresh the mocks values
		fixture = TestBed.createComponent(LineListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

    let initModel = {code : '', name : '', node: ''};


      component.errorMessage

		//Check if error was given
		expect(component.inputModel).toEqual(initModel);
    expect(component.errorMessage).toEqual(errorMsg);
		
  });
  
  it('Should give error with handled message', () => {
    let lines = [{code:'code',name:'name',node1:'node1',node2:'node2',allowedDrivers:'allowedDrivers',allowedVehicles:'allowedVehicles',color:'color'},
      {code:'a',name:'a',node1:'a',node2:'a',allowedDrivers:'a',allowedVehicles:'a',color:'#a89732'}
      ];

      let errorMsg = "Http failure response for";
      let givenError = new Error(errorMsg);

		//Mock creations
		lineActionsServMock.getListLines.and.returnValue(throwError(givenError));
		lineMapperServMock.FromMDVListToViewList.and.returnValue(of([]));

		//Refresh the mocks values
		fixture = TestBed.createComponent(LineListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

    let initModel = {code : '', name : '', node: ''};

		//Check if error was given
		expect(component.inputModel).toEqual(initModel);
    expect(component.errorMessage).toEqual("Unable to reach server.");
		
  });

});
