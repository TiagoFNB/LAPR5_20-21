import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { throwError } from 'rxjs';

import { of } from 'rxjs/internal/observable/of';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { LineActionsService } from 'src/app/core/services/line-actions/line-actions.service';
import { NodeServiceService } from 'src/app/core/services/node-service.service';

import { NodeRegistrationComponent } from './node-registration.component';

describe('NodeRegistrationComponent', () => {
	let component: NodeRegistrationComponent;
	let fixture: ComponentFixture<NodeRegistrationComponent>;

	let testBed;

	//Create service mocks

	let nodeActionsServMock = jasmine.createSpyObj(NodeServiceService, [ 'getNodesByNames', 'registerNode' ]);

	//nodeActionsServMock.getNodesByNames.and.returnValue(of([]));
	beforeEach(async () => {
		testBed = await TestBed.configureTestingModule({
			declarations: [ NodeRegistrationComponent ],
			providers: [ { provide: NodeServiceService, useValue: nodeActionsServMock } ],
			imports: [
				FormsModule,
				AppRoutingModule,
				ColorPickerModule,
				MatSelectModule,
				BrowserModule,
				BrowserAnimationsModule
			]
		}).compileComponents();
	});

	it('component should be created', () => {
		//Refresh the mocks values
		nodeActionsServMock.getNodesByNames.and.returnValue(of([ 'shortName1', 'shortName2' ]));
		fixture = TestBed.createComponent(NodeRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		expect(component).toBeTruthy();
	});

	it('Should create a Node', async () => {
		//Mock creations
		const expectedN = {
			name: undefined,
			shortName: undefined,
			latitude: undefined,
			longitude: undefined,
			isDepot: '',
			isReliefPoint: '',
			crewTravelTimes: undefined,
			crewTravelTimeReferenceNode: undefined
		};
		nodeActionsServMock.getNodesByNames.and.returnValue(of([ { name: 'Name1' }, { name: 'Name2' } ]));
		nodeActionsServMock.registerNode.and.returnValue(of({ name: 'node1' }));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeRegistrationComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();

		component.node.name = 'name1';
		component.node.shortName = 'sname1';
		component.node.latitude = 40;
		component.node.longitude = 40;
		component.node.isDepot = 'true';
		component.node.isReliefPoint = 'false';
		component.node.crewTravelTimes = 30;
		component.node.crewTravelTimeReferenceNode = 'refNode1';

		// test if list of node shortnames is okay
		expect(component.getNodesNames()).toEqual([ 'Name1', 'Name2' ]);

		//Check if all values are correctly initialized after ngOnInit
		expect(component.node.name).toEqual('name1');
		expect(component.node.shortName).toEqual('sname1');
		expect(component.node.latitude).toEqual(40);
		expect(component.node.longitude).toEqual(40);
		expect(component.node.isDepot).toEqual('true');
		expect(component.node.isReliefPoint).toEqual('false');
		expect(component.node.crewTravelTimes).toEqual(30);
		expect(component.node.crewTravelTimeReferenceNode).toEqual('refNode1');

		//submit
		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Node Created Sucessfully ');
	});

	it('List of node short names is not retrieved still creates the node while presenting an error message', async () => {
		//Mock creations
		const expectedN = {
			name: undefined,
			shortName: undefined,
			latitude: undefined,
			longitude: undefined,
			isDepot: '',
			isReliefPoint: '',
			crewTravelTimes: undefined,
			crewTravelTimeReferenceNode: undefined
		};
		nodeActionsServMock.getNodesByNames.and.returnValue(throwError({ error: 'proxy' }));
		nodeActionsServMock.registerNode.and.returnValue(of({ name: 'node1' }));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeRegistrationComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();

		component.node.name = 'name1';
		component.node.shortName = 'sname1';
		component.node.latitude = 40;
		component.node.longitude = 40;
		component.node.isDepot = 'true';
		component.node.isReliefPoint = 'false';
		component.node.crewTravelTimes = 30;
		component.node.crewTravelTimeReferenceNode = 'refNode1';

		expect(component.nodesNames).toBeUndefined();

		//simulates a keyup event
		component.getNodesNames();
		expect(component.errorMessage).toEqual('Error: could not connect to backend server');
		//Check if all values are correctly initialized after ngOnInit
		expect(component.node.name).toEqual('name1');
		expect(component.node.shortName).toEqual('sname1');
		expect(component.node.latitude).toEqual(40);
		expect(component.node.longitude).toEqual(40);
		expect(component.node.isDepot).toEqual('true');
		expect(component.node.isReliefPoint).toEqual('false');
		expect(component.node.crewTravelTimes).toEqual(30);
		expect(component.node.crewTravelTimeReferenceNode).toEqual('refNode1');

		//submit
		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Node Created Sucessfully ');
	});

	it('Should Not create Node', async () => {
		//mock behaviour
		nodeActionsServMock.getNodesByNames.and.returnValue(of([ { name: 'Name1' }, { name: 'Name2' } ]));
		nodeActionsServMock.registerNode.and.returnValue(throwError({ error: 'error' }));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeRegistrationComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();

		component.node.name = 'name1';
		component.node.shortName = 'sname1';
		component.node.latitude = 40;
		component.node.longitude = 40;
		component.node.isDepot = 'true';
		component.node.isReliefPoint = 'false';
		component.node.crewTravelTimes = 30;
		component.node.crewTravelTimeReferenceNode = 'refNode1';

		// test if list of node shortnames is okay
		expect(component.getNodesNames()).toEqual([ 'Name1', 'Name2' ]);

		//Check if all values are correctly initialized
		expect(component.node.name).toEqual('name1');
		expect(component.node.shortName).toEqual('sname1');
		expect(component.node.latitude).toEqual(40);
		expect(component.node.longitude).toEqual(40);
		expect(component.node.isDepot).toEqual('true');
		expect(component.node.isReliefPoint).toEqual('false');
		expect(component.node.crewTravelTimes).toEqual(30);
		expect(component.node.crewTravelTimeReferenceNode).toEqual('refNode1');

		//submit
		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.errorMessage).toEqual('error');
		expect(component.successMessage).toBeUndefined();
	});
});
