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
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { PathActionsService } from "src/app/core/services/path-actions/path-actions.service";
import { PathMapperService } from 'src/app/core/services/path-actions/mappers/path-mapper.service';
import { PathListingComponent } from 'src/app/listings/path-listing/path-listing.component';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

describe('List-Paths-Integration', () => {

    let httpClientSpy;
    let Lservice : PathActionsService;
    let LMapperservice : PathMapperService;
    let component : PathListingComponent;
    let fixture: ComponentFixture<PathListingComponent>;

    let testBed; 

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
        Lservice = new PathActionsService(httpClientSpy as any);
        LMapperservice = new PathMapperService();
      });

      //Init the component
    beforeEach(async () => {
        testBed = await TestBed.configureTestingModule({declarations:[PathListingComponent],providers:[
          { provide: PathActionsService, useValue: Lservice },
          {provide: PathMapperService, useValue: LMapperservice}],
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
            MatIconModule,
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

      it('Paths should be listed', () => {
        let lines = [{key:'code1',line:'name1',type:'Go',pathSegments:{node1:'PARED',node2:'LORDL',duration:50,distance:50}},
        {key:'code2',line:'name2',type:'Go',pathSegments:{node1:'LORDL',node2:'PARED',duration:100,distance:150}}];

        //Mock the values
        httpClientSpy.get.and.returnValue(of(lines));

        //Refresh the mocks values
        fixture = TestBed.createComponent(PathListingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        let initModel = {key : '', line: '', type: ''};

        //Check if all values are correctly initialized after ngOnInit
		expect(component.inputModel).toEqual(initModel);
        expect(component.dataSource.data.length).toEqual(lines.length);
      });     

      it('Error: Paths could not be obtained', () => {
        let err = new Error('Test error');

        //Mock the values
        httpClientSpy.get.and.returnValue(throwError(err));

        //Refresh the mocks values
        fixture = TestBed.createComponent(PathListingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        let initModel = {key : '', line: '', type: ''};

        //Check if all values are correctly initialized after ngOnInit
		expect(component.inputModel).toEqual(initModel);

        expect(component.errorMessage).toEqual(err.message);
      });     

});