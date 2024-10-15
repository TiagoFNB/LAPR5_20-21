import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { throwError } from 'rxjs';

import { of } from 'rxjs/internal/observable/of';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { PathRegistrationComponent } from './path-registration.component';
import { PathActionsService } from '../../core/services/path-actions/path-actions.service'
import { PathSegment } from 'src/app/shared/models/Path/PathSegment/PathSegment';
import { LineActionsService } from '../../core/services/line-actions/line-actions.service'
import { NodeServiceService } from 'src/app/core/services/node-service.service';

describe('PathRegistrationComponent', () => {
  let component: PathRegistrationComponent;
  let fixture: ComponentFixture<PathRegistrationComponent>;

  let pathActionsServMock = jasmine.createSpyObj(PathActionsService, ['registerPath', 'handleErrors']);
  let lineActionsServMock = jasmine.createSpyObj(LineActionsService, ['getListLines']);
  let nodeActionsServMock = jasmine.createSpyObj(NodeServiceService, ['getNodesByNames']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PathRegistrationComponent],
      providers: [{
        provide: PathActionsService, useValue: pathActionsServMock
      },
      {
        provide: LineActionsService, useValue: lineActionsServMock
      },
      { provide: NodeServiceService, useValue: nodeActionsServMock }
      ],
      imports: [
        FormsModule,
        AppRoutingModule,
        ColorPickerModule,
        MatSelectModule,
        BrowserModule,
        BrowserAnimationsModule
      ]
    })
      .compileComponents();
  });

  it('component should be created', () => {
    //Refresh the mocks values
    pathActionsServMock.registerPath.and.returnValue(of({ key: 'pathTest1' }));
    lineActionsServMock.getListLines.and.returnValue(of([]));

    //	vehicleTypeActionsServMock.registerVehicleType.and.returnValue(of([ 'vh1', 'vh2' ]));
    fixture = TestBed.createComponent(PathRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('Should create a Path  case 1', async () => {
    pathActionsServMock.registerPath.and.returnValue(of({ key: 'pathTest1' }));
    lineActionsServMock.getListLines.and.returnValue(of([]));

    //Refresh the mocks values
    fixture = TestBed.createComponent(PathRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let path = {
      key: undefined,
      line: undefined,
      pathSegments: undefined,
      isEmpty: undefined
    };

    //Check if all values are correctly initialized after ngOnInit
    expect(component.path.key).toEqual(path.key);

    expect(component.path.line).toEqual(path.line);
    expect(component.path.pathSegments).toEqual(path.pathSegments);

    component.pathSegmentsArray = [{ "node1": 'yo', "node2": 'yo', "duration": 50, "distance": 50 }],
      expect(component.pathSegmentsArray.length).toEqual(1);


    //submit
    component.onSubmit(new NgForm(undefined, undefined));

    expect(component.successMessage).toEqual('Path Created Sucessfully ');
    expect(component.errorMessage).toBeUndefined();
  });

  it('Should Not create a Path error  case 1 (error comes from service)', async () => {
    lineActionsServMock.getListLines.and.returnValue(of([]));

    pathActionsServMock.registerPath.and.returnValue(throwError({ error: 'error' }));

    //Refresh the mocks values
    fixture = TestBed.createComponent(PathRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let path = {
      key: undefined,
      line: undefined,
      pathSegments: undefined,
      isEmpty: undefined
    };




    //Check if all values are correctly initialized after ngOnInit
    expect(component.path.key).toEqual(path.key);

    expect(component.path.line).toEqual(path.line);
    expect(component.path.pathSegments).toEqual(path.pathSegments);

    component.pathSegmentsArray = [{ "node1": 'yo', "node2": 'yo', "duration": 50, "distance": 50 }],
      expect(component.pathSegmentsArray.length).toEqual(1);

    //submit
    component.onSubmit(new NgForm(undefined, undefined));
    expect(component.errorMessage).toEqual('error');

    expect(component.successMessage).toBeUndefined();
  });
});
