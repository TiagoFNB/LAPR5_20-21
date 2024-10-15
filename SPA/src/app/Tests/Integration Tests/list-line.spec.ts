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
import { LineActionsService } from "src/app/core/services/line-actions/line-actions.service";
import { LineMapperService } from 'src/app/core/services/line-actions/mappers/line-mapper.service';
import { LineListingComponent } from 'src/app/listings/line-listing/line-listing.component';

describe('List-Lines-Integration', () => {

    let httpClientSpy;
    let Lservice : LineActionsService;
    let LMapperservice : LineMapperService;
    let component : LineListingComponent;
    let fixture: ComponentFixture<LineListingComponent>;

    let testBed; 

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post','get']);
        Lservice = new LineActionsService(httpClientSpy as any);
        LMapperservice = new LineMapperService();
      });

      //Init the component
    beforeEach(async () => {
        testBed = await TestBed.configureTestingModule({declarations:[LineListingComponent],providers:[
          { provide: LineActionsService, useValue: Lservice },
          {provide: LineMapperService, useValue: LMapperservice}],
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

      it('Lines should be listed', () => {
        let lines = [{key:'code',name:'name',terminalNode1:'node1',terminalNode2:'node2',AllowedDrivers:[],AllowedVehicles:[],RGB:{red:0,green:0,blue:0}},
        {key:'code',name:'name',terminalNode1:'node1',terminalNode2:'node2',AllowedDrivers:[],AllowedVehicles:[],RGB:{red:0,green:0,blue:0}}];

        //Mock the values
        httpClientSpy.get.and.returnValue(of(lines));

        //Refresh the mocks values
        fixture = TestBed.createComponent(LineListingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        let initModel = {code : '', name : '', node: ''};

        //Check if all values are correctly initialized after ngOnInit
		expect(component.inputModel).toEqual(initModel);
        expect(component.dataSource.data.length).toEqual(lines.length);
      });     

      it('Error: Lines could not be obtained', () => {
        let err = new Error('Test error');

        //Mock the values
        httpClientSpy.get.and.returnValue(throwError(err));

        //Refresh the mocks values
        fixture = TestBed.createComponent(LineListingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        let initModel = {code : '', name : '', node: ''};

        //Check if all values are correctly initialized after ngOnInit
		expect(component.inputModel).toEqual(initModel);

        expect(component.errorMessage).toEqual(err.message);
      });     

});