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
import { PathActionsService } from 'src/app/core/services/path-actions/path-actions.service';
import { PathMapperService } from 'src/app/core/services/path-actions/mappers/path-mapper.service';

import { PathListingComponent } from './path-listing.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('PathListingComponent', () => {
  let component: PathListingComponent;
  let fixture: ComponentFixture<PathListingComponent>;

  let testBed;

  //Create service mocks
	let pathActionsServMock = jasmine.createSpyObj(PathActionsService, [ 'getAllPaths' ]);
	let pathMapperServMock = jasmine.createSpyObj(PathMapperService, [ 'FromMDVListToViewList' ]);

  beforeEach(async () => {
		testBed = await TestBed.configureTestingModule({
			declarations: [ PathListingComponent ],
			providers: [
				{ provide: PathActionsService, useValue: pathActionsServMock },
				{ provide: PathMapperService, useValue: pathMapperServMock },
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
            MatSortModule,
            MatDialogModule,
            MatDividerModule,
            MatGridListModule,
            MatInputModule,
            MatListModule,
            MatNativeDateModule,
            MatRippleModule,
            MatSelectModule,
            MatSlideToggleModule,
            MatSortModule,
            MatTableModule,
            MatTooltipModule,
			]
		}).compileComponents();
	});

  it('component should be created', () => {
		//Mock creations
		pathActionsServMock.getAllPaths.and.returnValue(of([]));
		pathMapperServMock.FromMDVListToViewList.and.returnValue(of([]));

		//Refresh the mocks values
		fixture = TestBed.createComponent(PathListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		expect(component).toBeTruthy();
  });
  
  it('Should contain 0 paths', () => {
		//Mock creations
		pathActionsServMock.getAllPaths.and.returnValue(of([]));
		pathMapperServMock.FromMDVListToViewList.and.returnValue(of([]));

		//Refresh the mocks values
		fixture = TestBed.createComponent(PathListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

    let initModel = {key : '', line : '', type: ''};




		//Check if all values are correctly initialized after ngOnInit
		expect(component.inputModel).toEqual(initModel);

    let dt = component.dataSource.data.subscribe(
      (data) => {expect(data.length).toEqual(0);},
      (error) => {fail;}
    );
		
  });
  
  it('Should contain 2 paths', () => {
    let lines = [{key:'code1',line:'name1',type:'Go',pathSegments:{node1:'PARED',node2:'LORDL',duration:50,distance:50}},
        {key:'code2',line:'name2',type:'Go',pathSegments:{node1:'LORDL',node2:'PARED',duration:100,distance:150}}];

		//Mock creations
		pathActionsServMock.getAllPaths.and.returnValue(of([]));
		pathMapperServMock.FromMDVListToViewList.and.returnValue(of(lines));

		//Refresh the mocks values
		fixture = TestBed.createComponent(PathListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

    let initModel = {key : '', line : '', type: ''};




		//Check if all values are correctly initialized after ngOnInit
		expect(component.inputModel).toEqual(initModel);

    let dt = component.dataSource.data.subscribe(
      (data) => {expect(data).toEqual(lines);},
      (error) => {fail;}
    );
		
  });
  
  it('Should give error with the given message', () => {
    let lines = [{key:'code1',line:'name1',type:'Go',pathSegments:{node1:'PARED',node2:'LORDL',duration:50,distance:50}},
    {key:'code2',line:'name2',type:'Go',pathSegments:{node1:'LORDL',node2:'PARED',duration:100,distance:150}}];


      let errorMsg = "Custom error message.";
      let givenError = new Error(errorMsg);

		//Mock creations
		pathActionsServMock.getAllPaths.and.returnValue(throwError(givenError));
		pathMapperServMock.FromMDVListToViewList.and.returnValue(of(lines));

		//Refresh the mocks values
		fixture = TestBed.createComponent(PathListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

    let initModel = {key : '', line : '', type: ''};


    component.errorMessage

		//Check if error was given
		expect(component.inputModel).toEqual(initModel);
    expect(component.errorMessage).toEqual(errorMsg);
		
  });
  
  it('Should give error with handled message', () => {
    let lines = [{key:'code1',line:'name1',type:'Go',pathSegments:{node1:'PARED',node2:'LORDL',duration:50,distance:50}},
        {key:'code2',line:'name2',type:'Go',pathSegments:{node1:'LORDL',node2:'PARED',duration:100,distance:150}}];


      let errorMsg = "Http failure response for";
      let givenError = new Error(errorMsg);

		//Mock creations
		pathActionsServMock.getAllPaths.and.returnValue(throwError(givenError));
		pathMapperServMock.FromMDVListToViewList.and.returnValue(of([]));

		//Refresh the mocks values
		fixture = TestBed.createComponent(PathListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

    let initModel = {key : '', line : '', type: ''};

		//Check if error was given
		expect(component.inputModel).toEqual(initModel);
    expect(component.errorMessage).toEqual("Unable to reach server.");
		
  });

});
