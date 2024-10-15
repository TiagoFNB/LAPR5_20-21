import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { VehicleDutyViewDTO } from 'src/app/shared/dtos/VehicleDuty/VehicleDutyViewDTO';
import { VehicleDuty } from 'src/app/shared/models/VehicleDuty/VehicleDuty';
import { VehicleDutySPAtoMDVDTO } from './../../../shared/dtos/VehicleDuty/VehicleDutySPAtoMDVDTO';
import { VehicleDutyActionsService } from './vehicle-duty-actions.service';
let httpClientSpy : {get : jasmine.Spy; post: jasmine.Spy };
let Vservice:VehicleDutyActionsService;
let mapperSpy: {FromModelToVehicleDutyMDVDto:jasmine.Spy};

describe('VehicleDutyActionsService', () => {
  

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    mapperSpy = jasmine.createSpyObj('VehicleDutyMapperService', [ 'FromModelToVehicleDutyMDVDto']);
    Vservice = new VehicleDutyActionsService(httpClientSpy as any, mapperSpy as any);
  });

  it('should be created', () => {
    expect(Vservice).toBeTruthy();
  });

 

    it('Should create VehicleDuty', () => {
      const expectedDto: VehicleDutySPAtoMDVDTO =
    {
      VehicleLicense:"AB-01-AA",
    VehicleDutyCode:"1234567890",
    }

    const domainV: VehicleDuty =
    {
      VehicleLicense:"AB-01-AA",
    VehicleDutyCode:"1234567890",
    }

      
      const inputV: VehicleDutyViewDTO =
    {
      code:"1234567890",
      vehicleLicense:"AB-01-AA",
    }
    
      
      mapperSpy.FromModelToVehicleDutyMDVDto.and.returnValue(of(expectedDto));
      let x= spyOn(VehicleDuty,'create').and.returnValue(domainV);
      httpClientSpy.post.and.returnValue(of(expectedDto)); 
   
        Vservice.registerVehicleDuty(inputV).subscribe(
          (dt) => 
            expect(dt).toEqual(expectedDto, 'expected vehicle duty'), fail);
      });
  
    it('should return an error when the vehicleduty is not sucessfully created ', () => {
      const expectedDto: VehicleDutySPAtoMDVDTO =
      {
        VehicleLicense:"AB-01-AA",
      VehicleDutyCode:"1234567890",
      }
  
      const domainV: VehicleDuty =
      {
        VehicleLicense:"AB-01-AA",
      VehicleDutyCode:"1234567890",
      }
  
        
        const inputV: VehicleDutyViewDTO =
      {
        code:"1234567890",
        vehicleLicense:"AB-01-AA",
      }
      
        
        mapperSpy.FromModelToVehicleDutyMDVDto.and.returnValue(of(expectedDto));
        
        
     
  
      let x = spyOn(VehicleDuty, 'create').and.throwError(new Error('Error creating VehicleDuty in test'));
      
      httpClientSpy.post.and.returnValue(of(expectedDto)); // this is to prove the mocks are working because if the above mocked method fails this mock wont even be called
    
  
      try {
        Vservice.registerVehicleDuty(inputV).subscribe(
          (dt) => {
            fail('expected an error, not a Vehicle');
          },
          (error) => {
            fail('expected an error from creating model Vehicle, not a http error');
          }
        );
      } catch (error) {
 
        expect(error.message).toContain('Error creating VehicleDuty in test');
      }
    });

    it('Should return error when the server returns a 404', () => {
      const expectedDto: VehicleDutySPAtoMDVDTO =
      {
        VehicleLicense:"AB-01-AA",
      VehicleDutyCode:"1234567890",
      }
  
      const domainV: VehicleDuty =
      {
        VehicleLicense:"AB-01-AA",
      VehicleDutyCode:"1234567890",
      }
  
        
        const inputV: VehicleDutyViewDTO =
      {
        code:"1234567890",
        vehicleLicense:"AB-01-AA",
      }
      
        
        mapperSpy.FromModelToVehicleDutyMDVDto.and.returnValue(of(expectedDto));
        let x= spyOn(VehicleDuty,'create').and.returnValue(domainV);

      const expectedResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404,
        statusText: 'Not Found'
      });
      
      httpClientSpy.post.and.returnValue(throwError(expectedResponse)); // this is to prove the mocks are working because if the above mocked method fails this mock wont even be called
    
  
     
        Vservice.registerVehicleDuty(inputV).subscribe(
          (vts) => fail('expected an error, not a vehicle'),
          (error) => {
          expect(error.error).toContain('test 404 error');
        });
         
      });  
      
    

    it('should return a custom error when the server returns a duplicate error message', () => {
      const expectedDto: VehicleDutySPAtoMDVDTO =
      {
        VehicleLicense:"AB-01-AA",
      VehicleDutyCode:"1234567890",
      }
  
      const domainV: VehicleDuty =
      {
        VehicleLicense:"AB-01-AA",
      VehicleDutyCode:"1234567890",
      }
  
        
        const inputV: VehicleDutyViewDTO =
      {
        code:"1234567890",
        vehicleLicense:"AB-01-AA",
      }
      
        
        mapperSpy.FromModelToVehicleDutyMDVDto.and.returnValue(of(expectedDto));
        let x= spyOn(VehicleDuty,'create').and.returnValue(domainV);

      const expectedResponse = new HttpErrorResponse({
        error: 'E11000 duplicate',
        status: 404,
        statusText: 'Not Found'
      });
  
      
      httpClientSpy.post.and.returnValue(throwError( expectedResponse)); // this is to prove the mocks are working because if the above mocked method fails this mock wont even be called
    
  
     
        Vservice.registerVehicleDuty(inputV).subscribe(
          (vts) => fail('expected an error, not a vehicle'),
			(error) => {
				expect(error.error).toContain('E11000 duplicate');
			});
        });



});
