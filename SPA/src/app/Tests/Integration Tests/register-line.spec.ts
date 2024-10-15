import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { DriverTypeActionsService } from 'src/app/core/services/driverType-actions/driver-type-actions.service';
import { LineActionsService } from "src/app/core/services/line-actions/line-actions.service";
import { NodeServiceService } from 'src/app/core/services/node-service.service';
import { VehicleTypeActionsService } from 'src/app/core/services/vehicleType-actions/vehicle-type-actions.service';
import { LineRegistrationComponent } from 'src/app/registrations/line-registration/line-registration.component';

describe('Register-Line-Integration', () => {

    let httpClientSpy;
    let Lservice : LineActionsService;
    let Nservice : NodeServiceService;
    let DTservice : DriverTypeActionsService;
    let VTservice : VehicleTypeActionsService;
    let component : LineRegistrationComponent;
    let fixture: ComponentFixture<LineRegistrationComponent>;

    let testBed; 

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post','get']);
        Lservice = new LineActionsService(httpClientSpy as any);
        Nservice = new NodeServiceService(httpClientSpy as any);
        DTservice = new DriverTypeActionsService(httpClientSpy as any);
        VTservice = new VehicleTypeActionsService(httpClientSpy as any);
      });

      //Init the component
    beforeEach(async () => {
        testBed = await TestBed.configureTestingModule({declarations:[LineRegistrationComponent],providers:[
          { provide: LineActionsService, useValue: Lservice },
          {provide: VehicleTypeActionsService, useValue: VTservice},
          {provide: DriverTypeActionsService, useValue: DTservice},
          {provide: NodeServiceService, useValue: Nservice}], 
          imports: [FormsModule,AppRoutingModule,ColorPickerModule,MatSelectModule,BrowserModule,BrowserAnimationsModule]
        }).compileComponents();
      });

      it('New Line should be registered', () => {
        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(of(''));

        //Refresh the mocks values
        fixture = TestBed.createComponent(LineRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
       

        component.line.key='B';
        component.line.name='A';
        component.line.terminalNode1='nA';
        component.line.terminalNode2='nB';

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.successMessage).toEqual('Line was successfully registered.');
      });

      it('New Line should not be registered: An element is undefined', () => {
        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(of(''));

        //Refresh the mocks values
        fixture = TestBed.createComponent(LineRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
       

        component.line.key='B';
        component.line.terminalNode1='nA';
        component.line.terminalNode2='nB';

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual('One of the fields was not filled.');
      });


      it('New Line should not be registered: RGB format is incorrect', () => {
        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(of(''));

        //Refresh the mocks values
        fixture = TestBed.createComponent(LineRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        component.line.key='B';
        component.line.name='B';
        component.unformattedRGB="RGB(256,0,0)";
        component.line.terminalNode1='nA';
        component.line.terminalNode2='nB';

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual('The Color format is incorrect.');
      });

      it('New Line should not be registered: Error comes from the database', () => {
        let expError = new HttpErrorResponse({error:"Test error"});

        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(throwError(expError));

        //Refresh the mocks values
        fixture = TestBed.createComponent(LineRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        component.line.key='B';
        component.line.name='B';
        component.line.terminalNode1='nA';
        component.line.terminalNode2='nB';

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual('Test error');
      });

      it('New Line should not be registered: Error comes from the database 2', () => {
        let expError = new HttpErrorResponse({error:"E11000 duplicate"});

        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(throwError(expError));

        //Refresh the mocks values
        fixture = TestBed.createComponent(LineRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        component.line.key='B';
        component.line.name='B';
        component.line.terminalNode1='nA';
        component.line.terminalNode2='nB';

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual('Submitted line code already exists.');
      });


      it('New Line should not be registered: Error comes from the database 3', () => {
        let expError = new HttpErrorResponse({error:'child "code" fails because ["code" must only contain alpha-numeric characters]'});

        //Mock the values
        httpClientSpy.get.and.returnValue(of([]));
        httpClientSpy.post.and.returnValue(throwError(expError));

        //Refresh the mocks values
        fixture = TestBed.createComponent(LineRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    
        component.line.key='B';
        component.line.name='B';
        component.line.terminalNode1='nA';
        component.line.terminalNode2='nB';

        component.onSubmit(new NgForm(undefined,undefined));

        expect(component.errorMessage).toEqual('Code must only contain alpha-numeric characters.');
      });


});