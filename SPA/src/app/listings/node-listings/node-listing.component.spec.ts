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
import { NodeServiceService } from 'src/app/core/services/node-service.service';

import { NodeListingComponent } from './node-listing.component';

describe('NodeListingComponent', () => {
	let component: NodeListingComponent;
	let fixture: ComponentFixture<NodeListingComponent>;

	let testBed;

	//Create service mocks
	let NodeActionsServMock = jasmine.createSpyObj(NodeServiceService, [ 'getAllNodes' ]);

	beforeEach(async () => {
		testBed = await TestBed.configureTestingModule({
			declarations: [ NodeListingComponent ],
			providers: [ { provide: NodeServiceService, useValue: NodeActionsServMock } ],
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
				MatFormFieldModule
			]
		}).compileComponents();
	});

	it('component should be created', () => {
		//Mock creations
		NodeActionsServMock.getAllNodes.and.returnValue(of([]));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		expect(component).toBeTruthy();
	});

	it('Should contain 0 Nodes', () => {
		//Mock creations
		NodeActionsServMock.getAllNodes.and.returnValue(of([]));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		let initModel = { name: '', shortName: '', latitude: null, longitude: null };

		//Check if all values are correctly initialized after ngOnInit
		expect(component.inputModel).toEqual(initModel);
		expect(component.dbList.length).toEqual(0);
	});

	it('Should contain 2 Nodes', () => {
		let nodes = [
			{
				name: 'name1',
				shortName: 'shrtname1',
				latitude: 23,
				longitude: 24,
				isDepot: true,
				isReliefPoint: true
			},
			{
				name: 'name2',
				shortName: 'shrtname2',
				latitude: 23,
				longitude: 22,
				isDepot: true,
				isReliefPoint: false
			}
		];

		//Mock creations
		NodeActionsServMock.getAllNodes.and.returnValue(of(nodes));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		let initModel = { name: '', shortName: '', latitude: null, longitude: null };

		//Check if all values are correctly initialized after ngOnInit
		expect(component.inputModel).toEqual(initModel);

		expect(component.dbList.length).toEqual(2);

		expect(component.dbList[0].name).toEqual('name1');
		expect(component.dbList[0].shortName).toEqual('shrtname1');
		expect(component.dbList[0].latitude).toEqual(23);
		expect(component.dbList[0].longitude).toEqual(24);
		expect(component.dbList[0].isDepot).toBeTrue();
		expect(component.dbList[0].isReliefPoint).toBeTrue();

		expect(component.dbList[1].name).toEqual('name2');
		expect(component.dbList[1].shortName).toEqual('shrtname2');
		expect(component.dbList[1].latitude).toEqual(23);
		expect(component.dbList[1].longitude).toEqual(22);
		expect(component.dbList[1].isDepot).toBeTrue();
		expect(component.dbList[1].isReliefPoint).toBeFalse();
	});

	it('Should give error with the given message', () => {
		let nodes = [
			{
				name: 'name1',
				shortName: 'shrtname1',
				latitude: 23,
				longitude: 23,
				isDepot: true,
				isReliefPoint: true
			},
			{
				name: 'name2',
				shortName: 'shrtname2',
				latitude: 23,
				longitude: 23,
				isDepot: true,
				isReliefPoint: true
			}
		];

		let errorMsg = 'Custom error message.';
		let givenError = new Error(errorMsg);

		//Mock creations
		NodeActionsServMock.getAllNodes.and.returnValue(throwError(givenError));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		let initModel = { name: '', shortName: '', latitude: null, longitude: null };

		component.errorMessage;

		//Check if error was given
		expect(component.inputModel).toEqual(initModel);
		expect(component.errorMessage).toEqual(errorMsg);
	});

	it('Should give error with handled message', () => {
		let nodes = [
			{
				name: 'name1',
				shortName: 'shrtname1',
				latitude: 23,
				longitude: 23,
				isDepot: true,
				isReliefPoint: true
			},
			{
				name: 'name2',
				shortName: 'shrtname2',
				latitude: 23,
				longitude: 23,
				isDepot: true,
				isReliefPoint: true
			}
		];

		let errorMsg = 'Http failure response for';
		let givenError = new Error(errorMsg);

		//Mock creations
		NodeActionsServMock.getAllNodes.and.returnValue(throwError(givenError));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		let initModel = { name: '', shortName: '', latitude: null, longitude: null };

		//Check if error was given
		expect(component.inputModel).toEqual(initModel);
		expect(component.errorMessage).toEqual('Unable to reach server.');
	});
});
