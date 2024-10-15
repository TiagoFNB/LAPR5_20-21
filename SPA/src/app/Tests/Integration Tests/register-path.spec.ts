import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { PathRegistrationComponent } from '../../registrations/path-registration/path-registration.component';
import { PathActionsService } from 'src/app/core/services/path-actions/path-actions.service';
import {LineActionsService} from 'src/app/core/services/line-actions/line-actions.service';
import {NodeServiceService} from 'src/app/core/services/node-service.service'
import { forwardRef } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('Register-Path-Integration', () => {
	let httpClientSpy;

	let pathService: PathActionsService;
    let lineService: LineActionsService;
    let nodeService: NodeServiceService;

	let fixture: ComponentFixture<PathRegistrationComponent>;
	let component: PathRegistrationComponent;
    let lineActionsServMock = jasmine.createSpyObj(LineActionsService, ['getListLines']);
	let testBed;


	beforeEach(() => {
		httpClientSpy = jasmine.createSpyObj('HttpClient', [ 'post', 'get' ]);

		pathService = new PathActionsService(httpClientSpy as any);
		lineService = new LineActionsService(httpClientSpy as any);
		nodeService = new NodeServiceService(httpClientSpy as any);

	});

	//Init the component
	beforeEach(async () => {
		testBed = await TestBed.configureTestingModule({
			declarations: [ PathRegistrationComponent ],
            providers: [ { provide: PathActionsService, useValue: pathService },
                { provide: LineActionsService, useValue: lineService },
				{ provide: NodeServiceService, useValue: nodeService },
				{
					provide: NG_VALUE_ACCESSOR,
					useExisting: forwardRef(() => PathRegistrationComponent),
					multi: true
				  } ],
				  imports: [FormsModule,AppRoutingModule,ColorPickerModule,MatSelectModule,BrowserModule,BrowserAnimationsModule]
		}).compileComponents();
	});

	it('New path should be registered with all fields defined', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([{name:'lineTest01', key:'lineTest01'}]));
		httpClientSpy.post.and.returnValue(of({}));

		//Refresh the mocks values
		fixture = TestBed.createComponent(PathRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
    
		component.path.key = 'path1';
		component.path.line = 'lineTest01';
		component.path.type = 'Go';
		component.path.pathSegments = [];
		component.path.isEmpty = true;
        
        let seg ={
			node1:'B',
			node2:'A',
			duration:5,
			distance:5
		}
		
		component.pathSegmentsArray.push(seg);

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.successMessage).toEqual('Path Created Sucessfully ');
	});

	it('New path should Not be registered because of key not defined', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([{name:'lineTest01', key:'lineTest01'}]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(PathRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

        component.pathSegment.node1 = 'yo',
        component.pathSegment.node2 = 'yo2',
        component.pathSegment.duration = 50,
        component.pathSegment.distance = 50,

        component.path.line = 'lineTest01';
		component.path.type = 'Go';
		component.path.pathSegments = [component.pathSegment];
		component.path.isEmpty = true;

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.errorMessage).toEqual('Identification is required');
	});

	it('New path should Not be registered because of line not defined', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([{name:'lineTest01', key:'lineTest01'}]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(PathRegistrationComponent);
		component = fixture.componentInstance;
        fixture.detectChanges();
        
        component.pathSegment.node1 = 'yo',
        component.pathSegment.node2 = 'yo2',
        component.pathSegment.duration = 50,
        component.pathSegment.distance = 50,

        component.path.key = 'yoyo';
		component.path.type = 'Go';
		component.path.pathSegments = [component.pathSegment];
		component.path.isEmpty = true;

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.errorMessage).toEqual('Line is required');
	});

	it('New path should Not be registered because of path type is not defined', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([{name:'lineTest01', key:'lineTest01'}]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(PathRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

        component.pathSegment.node1 = 'yo',
        component.pathSegment.node2 = 'yo2',
        component.pathSegment.duration = 50,
        component.pathSegment.distance = 50,

		component.DefinePathSegment();

        component.path.key = 'path1';
		component.path.line = 'lineTest01';
		component.path.isEmpty = true;

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.errorMessage).toEqual('Path type is required');
	});

	it('New path should Not be registered because of missing segments', () => {
		//Mock the values
		httpClientSpy.get.and.returnValue(of([{name:'lineTest01', key:'lineTest01'}]));
		httpClientSpy.post.and.returnValue(of(''));

		//Refresh the mocks values
		fixture = TestBed.createComponent(PathRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

        component.path.key = 'path1';
        component.path.line = 'lineTest01';
        component.path.type = 'Go';
		component.path.pathSegments = [];
		component.path.isEmpty = true;

		component.onSubmit(new NgForm(undefined, undefined));

		expect(component.errorMessage).toEqual(
			'Must add segments to the path'
		);
	});


});
