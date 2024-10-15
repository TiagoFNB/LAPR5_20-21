import { VehicleViewDTO } from './../../../shared/dtos/Vehicle/VehicleViewDto';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Vehicle } from 'src/app/shared/models/Vehicle/Vehicle';

import { VehicleActionsService } from '../vehicle-actions/vehicle-actions.service';
import { VehicleSPAtoMDVDTO } from 'src/app/shared/dtos/Vehicle/VehicleSPAtoMDVDTO';

let httpClientSpy : {get : jasmine.Spy; post: jasmine.Spy };
let Vservice:VehicleActionsService;
let mapperSpy: { FromViewToModelDto: jasmine.Spy ,FromModelToVehicleMDVDto:jasmine.Spy};

describe('VehicleActionsService', () => {
  

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    mapperSpy = jasmine.createSpyObj('VehicleMapperService', [ 'FromViewToModelDto', 'FromModelToVehicleMDVDto']);
    Vservice = new VehicleActionsService(httpClientSpy as any, mapperSpy as any);
  });

  it('should be created', () => {
    expect(Vservice).toBeTruthy();
  });

  it('Should get VehicleList using http request', () => {
    const expectedVs: VehicleSPAtoMDVDTO[] =
    [{
      license:"AB-01-AA",
      vin:"12345678901234567",
      type:"VehicleTypeTT",
      date:"2015/12/25"
  }, { license:"AB-01-AA",
  vin:"12345678901234567",
  type:"VehicleTypeTT",
  date:"2015/12/25" }];

    httpClientSpy.get.and.returnValue(of(expectedVs));

    Vservice.getVehicles().subscribe(
      heroes => expect(heroes).toEqual(expectedVs, 'expected driver types'),
      fail
    );
  });

    it('should return an error when the server returns a 404', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });

      httpClientSpy.get.and.returnValue(throwError(errorResponse));

      Vservice.getVehicles().subscribe(
        vts => fail('expected an error, not vehicles'),
        error => expect(error.message).toContain('Not Found')
      );

    });

    it('Should create Vehicle', () => {
      const expectedDto: VehicleSPAtoMDVDTO =
    {
      license:"AB-01-AA",
      vin:"12345678901234567",
      type:"VehicleTypeTT",
      date:"2015/12/25"};

      const expectedV: Vehicle =
    {
      license:"AB-01-AA",
      vin:"12345678901234567",
      type:"VehicleTypeTT",
      entryDateOfService:"2015/12/25"};

      const vehicle =
      {
        license:"AB-01-AA",
        vin:"12345678901234567",
        type:"VehicleTypeTT",
        entryDateOfService:"2015/12/25"};

      const inputV: VehicleViewDTO =
    {
      license:"AB-01-AA",
      vin:"12345678901234567",
      type:"VehicleTypeTT",
      entryDateOfService:new Date()};
    
      mapperSpy.FromViewToModelDto.and.returnValue(of(vehicle));
      mapperSpy.FromModelToVehicleMDVDto.and.returnValue(of(expectedDto));
      let x= spyOn(Vehicle,'create').and.returnValue(expectedV);
      httpClientSpy.post.and.returnValue(of(expectedDto)); 
   
        Vservice.registerVehicle(inputV).subscribe(
          (dt) => 
            expect(dt).toEqual(expectedDto, 'expected driver type'), fail);
      });
  
    it('should return an error when the vehicle is not sucessfully created ', () => {
      const expectedDto: VehicleSPAtoMDVDTO =
      {
        license:"AB-01-AA",
        vin:"12345678901234567",
        type:"VehicleTypeTT",
        date:"2015/12/25"};
  
        const expectedV: Vehicle =
      {
        license:"AB-01-AA",
        vin:"12345678901234567",
        type:"VehicleTypeTT",
        entryDateOfService:"2015/12/25"};
  
        const vehicle =
        {
          license:"AB-01-AA",
          vin:"12345678901234567",
          type:"VehicleTypeTT",
          entryDateOfService:"2015/12/25"};
  
        const inputV: VehicleViewDTO =
      {
        license:"AB-01-AA",
        vin:"12345678901234567",
        type:"VehicleTypeTT",
        entryDateOfService:new Date()};
      
        mapperSpy.FromViewToModelDto.and.returnValue(of(vehicle));
        mapperSpy.FromModelToVehicleMDVDto.and.returnValue(of(expectedDto));
  
      let x = spyOn(Vehicle, 'create').and.throwError(new Error('Error creating Vehicle in test'));
      
      httpClientSpy.post.and.returnValue(of(expectedDto)); // this is to prove the mocks are working because if the above mocked method fails this mock wont even be called
    
  
      try {
        Vservice.registerVehicle(inputV).subscribe(
          (dt) => {
            fail('expected an error, not a Vehicle');
          },
          (error) => {
            fail('expected an error from creating model Vehicle, not a http error');
          }
        );
      } catch (error) {
 
        expect(error.message).toContain('Error creating Vehicle in test');
      }
    });

    it('Should return error when the server returns a 404', () => {
      const expectedDto: VehicleSPAtoMDVDTO =
      {
        license:"AB-01-AA",
        vin:"12345678901234567",
        type:"VehicleTypeTT",
        date:"2015/12/25"};
  
        const expectedV: Vehicle =
      {
        license:"AB-01-AA",
        vin:"12345678901234567",
        type:"VehicleTypeTT",
        entryDateOfService:"2015/12/25"};
  
        const vehicle =
        {
          license:"AB-01-AA",
          vin:"12345678901234567",
          type:"VehicleTypeTT",
          entryDateOfService:"2015/12/25"};
  
        const inputV: VehicleViewDTO =
      {
        license:"AB-01-AA",
        vin:"12345678901234567",
        type:"VehicleTypeTT",
        entryDateOfService:new Date()};
      
        mapperSpy.FromViewToModelDto.and.returnValue(of(vehicle));
        mapperSpy.FromModelToVehicleMDVDto.and.returnValue(of(expectedDto));
        let x= spyOn(Vehicle,'create').and.returnValue(expectedV);

      const expectedResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404,
        statusText: 'Not Found'
      });
      
      httpClientSpy.post.and.returnValue(throwError(expectedResponse)); // this is to prove the mocks are working because if the above mocked method fails this mock wont even be called
    
  
     
        Vservice.registerVehicle(inputV).subscribe(
          (vts) => fail('expected an error, not a vehicle'),
          (error) => {
          expect(error.error).toContain('test 404 error');
        });
         
      });  
      
    

    it('should return a custom error when the server returns a duplicate error message', () => {
      const expectedDto: VehicleSPAtoMDVDTO =
      {
        license:"AB-01-AA",
        vin:"12345678901234567",
        type:"VehicleTypeTT",
        date:"2015/12/25"};
  
        const expectedV: Vehicle =
      {
        license:"AB-01-AA",
        vin:"12345678901234567",
        type:"VehicleTypeTT",
        entryDateOfService:"2015/12/25"};
  
        const vehicle =
        {
          license:"AB-01-AA",
          vin:"12345678901234567",
          type:"VehicleTypeTT",
          entryDateOfService:"2015/12/25"};
  
        const inputV: VehicleViewDTO =
      {
        license:"AB-01-AA",
        vin:"12345678901234567",
        type:"VehicleTypeTT",
        entryDateOfService:new Date()};
      
        mapperSpy.FromViewToModelDto.and.returnValue(of(vehicle));
        mapperSpy.FromModelToVehicleMDVDto.and.returnValue(of(expectedDto));
        let x= spyOn(Vehicle,'create').and.returnValue(expectedV);

      const expectedResponse = new HttpErrorResponse({
        error: 'E11000 duplicate',
        status: 404,
        statusText: 'Not Found'
      });
  
      
      httpClientSpy.post.and.returnValue(throwError( expectedResponse)); // this is to prove the mocks are working because if the above mocked method fails this mock wont even be called
    
  
     
        Vservice.registerVehicle(inputV).subscribe(
          (vts) => fail('expected an error, not a vehicle'),
			(error) => {
				expect(error.error).toContain('E11000 duplicate');
			});
        });



});
