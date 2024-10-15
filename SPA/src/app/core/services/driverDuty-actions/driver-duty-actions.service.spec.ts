import {HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { DriverDutyViewDTO } from 'src/app/shared/dtos/DriverDuty/DriverDutyViewDTO';
import { DriverDuty } from 'src/app/shared/models/DriverDuty/DriverDuty';
import { DriverDutyActionsService } from './driver-duty-actions.service';

let httpClientSpy : {get : jasmine.Spy; post: jasmine.Spy };
let DTservice: DriverDutyActionsService;

describe('DriverDutyActionsService', () => {

  beforeEach(() => {
    // TODO: spy on other methods too
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    DTservice = new DriverDutyActionsService(httpClientSpy as any);
    
  });

  it('should be created', () => {
    expect(DTservice).toBeTruthy();
  });

  it('Should post DriverDuty using http request', () => {
    const inputDTO: DriverDutyViewDTO =
    { code: '1234567890', driverCode: '123456789' };

    const expectedResult : DriverDuty = {DriverDutyCode: '1234567890', DriverMecNumber: '123456789'};

    httpClientSpy.post.and.returnValue(of(expectedResult));

    DTservice.registerDriverDuty(inputDTO).subscribe(
      heroes => expect(heroes).toEqual(expectedResult, 'expected driver types'),
      fail
    );
  });

    it('Should return an error when the server returns an error', () => {
        const inputDTO: DriverDutyViewDTO =
    { code: '1234567890', driverCode: '123456789' };

      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });

      httpClientSpy.post.and.returnValue(throwError(errorResponse));

      DTservice.registerDriverDuty(inputDTO).subscribe(
        vts => fail('expected an error'),
        error => expect(error.message).toContain('Not Found')
      );

    });

    it('Should throw error when dto has invalid parameters', () => {
        const inputDTO: DriverDutyViewDTO =
        { code: '123', driverCode: '123' };
    
        const expectedResult : DriverDuty = {DriverDutyCode: '1234567890', DriverMecNumber: '123456789'};
    
        httpClientSpy.post.and.returnValue(of(expectedResult));
    
        try{
            DTservice.registerDriverDuty(inputDTO).subscribe(
                res => fail('expected an error'),
                error => fail('Error should not be inside observable'),
            );
        }
        catch(err){
            expect(err.message).toContain('length.')
        }
      });
       
      
});



 
