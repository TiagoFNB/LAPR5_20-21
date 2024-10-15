import {HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { DriverType } from 'src/app/shared/models/DriverType/DriverType';
import { DriverTypeActionsService } from './driver-type-actions.service';

let httpClientSpy : {get : jasmine.Spy; post: jasmine.Spy };
let DTservice: DriverTypeActionsService;

describe('DriverTypeActionsService', () => {

  beforeEach(() => {
    // TODO: spy on other methods too
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    DTservice = new DriverTypeActionsService(httpClientSpy as any);
    
  });

  it('should be created', () => {
    expect(DTservice).toBeTruthy();
  });

  it('Should get DriverTypeList using http request', () => {
    const expectedDTs: DriverType[] =
    [{ name: 'A', description: 'A' }, { name: 'B', description: 'B' }];

    httpClientSpy.get.and.returnValue(of(expectedDTs));

    DTservice.getDriverTypes().subscribe(
      heroes => expect(heroes).toEqual(expectedDTs, 'expected driver types'),
      fail
    );
  });

    it('should return an error when the server returns a 404', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });

      httpClientSpy.get.and.returnValue(throwError(errorResponse));

      DTservice.getDriverTypes().subscribe(
        vts => fail('expected an error, not vehicles types'),
        error => expect(error.message).toContain('Not Found')
      );

    });

    it('Should create DriverType', () => {
      const expectedDT: DriverType = {
        name: 'name1',
        description: 'desc1',
      };
      let x= spyOn(DriverType,'create').and.returnValue(expectedDT);
      httpClientSpy.post.and.returnValue(of(expectedDT)); 
   
        DTservice.registerDriverType(expectedDT).subscribe(
          (dt) => 
            expect(dt).toEqual(expectedDT, 'expected driver type'), fail);
      });
  
    it('should return an error when the node is not sucessfully created ', () => {
      const expectedDT: DriverType = {
        name: 'name1',
        description: 'desc1',
      };
  
      let x = spyOn(DriverType, 'create').and.throwError(new Error('Error creating DriverType in test'));
      
      httpClientSpy.post.and.returnValue(of(expectedDT)); // this is to prove the mocks are working because if the above mocked method fails this mock wont even be called
    
  
      try {
        DTservice.registerDriverType(expectedDT).subscribe(
          (dt) => {
            fail('expected an error, not a driver type');
          },
          (error) => {
            fail('expected an error from creating model drivertype, not a http error');
          }
        );
      } catch (error) {
 
        expect(error.message).toContain('Error creating DriverType in test');
      }
    });

    it('Should return error when the server returns a 404', () => {
      const expectedDT: DriverType = {
        name: 'name1',
        description: 'desc1',
      };
  
      const expectedResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404,
        statusText: 'Not Found'
      });
      
      httpClientSpy.post.and.returnValue(throwError(expectedResponse)); // this is to prove the mocks are working because if the above mocked method fails this mock wont even be called
    
  
     
        DTservice.registerDriverType(expectedDT).subscribe(
          (vts) => fail('expected an error, not a driver type'),
          (error) => {
          expect(error.error).toContain('test 404 error');
        });
         
      });  
      
    

    it('should return a custom error when the server returns a duplicate error message', () => {
      const expectedDT: DriverType = {
        name: 'name1',
        description: 'desc1',
      };
  
      const expectedResponse = new HttpErrorResponse({
        error: 'E11000 duplicate',
        status: 404,
        statusText: 'Not Found'
      });
  
      
      httpClientSpy.post.and.returnValue(throwError( expectedResponse)); // this is to prove the mocks are working because if the above mocked method fails this mock wont even be called
    
  
     
        DTservice.registerDriverType(expectedDT).subscribe(
          (vts) => fail('expected an error, not a node'),
			(error) => {
				expect(error.error).toContain('E11000 duplicate');
			});
        });
         
       
      
    });



 
