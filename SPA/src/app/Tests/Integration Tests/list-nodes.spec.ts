import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { NodeServiceService } from 'src/app/core/services/node-service.service';
import { NodeListingComponent } from 'src/app/listings/node-listings/node-listing.component';

describe('List-Lines-Integration', () => {
	let httpClientSpy;
	let Lservice: NodeServiceService;

	let component: NodeListingComponent;
	let fixture: ComponentFixture<NodeListingComponent>;

	let testBed;

	beforeEach(() => {
		httpClientSpy = jasmine.createSpyObj('HttpClient', [ 'post', 'get' ]);
		Lservice = new NodeServiceService(httpClientSpy as any);
	});

	//Init the component
	beforeEach(async () => {
		testBed = await TestBed.configureTestingModule({
			declarations: [ NodeListingComponent ],
			providers: [ { provide: NodeServiceService, useValue: Lservice } ],
			imports: [
				FormsModule,
				AppRoutingModule,
				ColorPickerModule,
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

	it('Nodes should be listed', () => {
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

		//Mock the values
		httpClientSpy.get.and.returnValue(of(nodes));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		let initModel = { name: '', shortName: '', latitude: null, longitude: null };

		//Check if all values are correctly initialized after ngOnInit
		expect(component.inputModel).toEqual(initModel);
		expect(component.dataSource.data.length).toEqual(nodes.length);
		expect(component.dbList.length).toEqual(nodes.length);
	});

	it('Error: Nodes could not be obtained', () => {
		let err = new Error('Test error');

		//Mock the values
		httpClientSpy.get.and.returnValue(throwError(err));

		//Refresh the mocks values
		fixture = TestBed.createComponent(NodeListingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		let initModel = { name: '', shortName: '', latitude: null, longitude: null };

		//Check if all values are correctly initialized after ngOnInit
		expect(component.inputModel).toEqual(initModel);

		expect(component.errorMessage).toEqual(err.message);
	});
});
