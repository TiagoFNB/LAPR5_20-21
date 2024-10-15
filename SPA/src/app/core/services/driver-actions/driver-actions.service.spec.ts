import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { DriverActionsService } from 'src/app/core/services/driver-actions/driver-actions.service';
import { DriverSPAtoMDVDTO } from 'src/app/shared/dtos/Driver/DriverSPAtoMDVDTO';
import { DriverViewDTO } from 'src/app/shared/dtos/Driver/DriverViewDto';
import { DriverViewtoModelDTO } from 'src/app/shared/dtos/Driver/DriverViewToModelDTO';
import { Driver } from 'src/app/shared/models/Driver/Driver';
let httpClientSpy : {get : jasmine.Spy; post: jasmine.Spy };
let Vservice:DriverActionsService;
let mapperSpy: { FromViewToModelDto: jasmine.Spy ,FromModelToDriverMDVDto:jasmine.Spy};

describe('DriverActionsService', () => {
  

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    mapperSpy = jasmine.createSpyObj('DriverMapperService', [ 'FromViewToModelDto', 'FromModelToDriverMDVDto']);
    Vservice = new DriverActionsService(httpClientSpy as any, mapperSpy as any);
  });

  it('should be created', () => {
    expect(Vservice).toBeTruthy();
  });

  

    it('Should create Driver', () => {
      const expectedDto: DriverSPAtoMDVDTO =
    {
        mechanographicNumber: "123456789",
        name: "string",
        birthDate: "02/20/2000",
        citizenCardNumber: "12345678",
        entryDate: "01/01/2020",
        departureDate:"01/02/2020",
        fiscalNumber: "123456789",
        type:"type1",
        license:"X",
        licenseDate:"01/02/2020"};

      const expectedD: Driver =
    {
        mechanographicNumber: "123456789",
        name: "string",
        birthDate: "02/20/2000",
        citizenCardNumber: "12345678",
        entryDate: "01/01/2020",
        departureDate:"01/02/2020",
        fiscalNumber: "123456789",
        type:"type1",
        license:"X",
        licenseDate:"01/02/2020"};

      const driver: DriverViewtoModelDTO =
      {
        mechanographicNumber: "123456789",
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"};

      const inputD: DriverViewDTO =
    {
        mechanographicNumber: "123456789",
        name: "string",
        birthDate: new Date("02/20/2000"),
        citizenCardNumber: "12345678",
        entryDate: new Date("01/01/2020"),
        departureDate: new Date("01/02/2020"),
        fiscalNumber: "123456789",
        type:"type1",
        license:"X",
        licenseDate:new Date("01/02/2020")};
    
      mapperSpy.FromViewToModelDto.and.returnValue(of(driver));
      mapperSpy.FromModelToDriverMDVDto.and.returnValue(of(expectedDto));
      let x= spyOn(Driver,'create').and.returnValue(expectedD);
      httpClientSpy.post.and.returnValue(of(expectedDto)); 
   
        Vservice.registerDriver(inputD).subscribe(
          (dt) => 
            expect(dt).toEqual(expectedDto, 'expected driver '), fail);
      });
  
    it('should return an error when the Driver is not sucessfully created ', () => {
        const expectedDto: DriverSPAtoMDVDTO =
        {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"};
    
          const expectedD: Driver =
        {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"};
    
          const driver: DriverViewtoModelDTO =
          {
            mechanographicNumber: "123456789",
                name: "string",
                birthDate: "02/20/2000",
                citizenCardNumber: "12345678",
                entryDate: "01/01/2020",
                departureDate:"01/02/2020",
                fiscalNumber: "123456789",
                type:"type1",
                license:"X",
                licenseDate:"01/02/2020"};
    
          const inputD: DriverViewDTO =
        {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: new Date("02/20/2000"),
            citizenCardNumber: "12345678",
            entryDate: new Date("01/01/2020"),
            departureDate: new Date("01/02/2020"),
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:new Date("01/02/2020")};
        
          mapperSpy.FromViewToModelDto.and.returnValue(of(driver));
          mapperSpy.FromModelToDriverMDVDto.and.returnValue(of(expectedDto));
  
      let x = spyOn(Driver, 'create').and.throwError(new Error('Error creating Driver in test'));
      
      httpClientSpy.post.and.returnValue(of(expectedDto)); // this is to prove the mocks are working because if the above mocked method fails this mock wont even be called
    
  
      try {
        Vservice.registerDriver(inputD).subscribe(
          (dt) => {
            fail('expected an error, not a Driver');
          },
          (error) => {
            fail('expected an error from creating model Driver, not a http error');
          }
        );
      } catch (error) {
 
        expect(error.message).toContain('Error creating Driver in test');
      }
    });

    it('Should return error when the server returns a 404', () => {
        const expectedDto: DriverSPAtoMDVDTO =
        {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"};
    
          const expectedD: Driver =
        {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"};
    
          const driver: DriverViewtoModelDTO =
          {
            mechanographicNumber: "123456789",
                name: "string",
                birthDate: "02/20/2000",
                citizenCardNumber: "12345678",
                entryDate: "01/01/2020",
                departureDate:"01/02/2020",
                fiscalNumber: "123456789",
                type:"type1",
                license:"X",
                licenseDate:"01/02/2020"};
    
          const inputD: DriverViewDTO =
        {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: new Date("02/20/2000"),
            citizenCardNumber: "12345678",
            entryDate: new Date("01/01/2020"),
            departureDate: new Date("01/02/2020"),
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:new Date("01/02/2020")};
        
          mapperSpy.FromViewToModelDto.and.returnValue(of(driver));
          mapperSpy.FromModelToDriverMDVDto.and.returnValue(of(expectedDto));
        let x= spyOn(Driver,'create').and.returnValue(expectedD);

      const expectedResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404,
        statusText: 'Not Found'
      });
      
      httpClientSpy.post.and.returnValue(throwError(expectedResponse)); // this is to prove the mocks are working because if the above mocked method fails this mock wont even be called
    
  
     
        Vservice.registerDriver(inputD).subscribe(
          (vts) => fail('expected an error, not a Driver'),
          (error) => {
          expect(error.error).toContain('test 404 error');
        });
         
      });  
      
    

    it('should return a custom error when the server returns a duplicate error message', () => {
        const expectedDto: DriverSPAtoMDVDTO =
        {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"};
    
          const expectedD: Driver =
        {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"};
    
          const driver: DriverViewtoModelDTO =
          {
            mechanographicNumber: "123456789",
                name: "string",
                birthDate: "02/20/2000",
                citizenCardNumber: "12345678",
                entryDate: "01/01/2020",
                departureDate:"01/02/2020",
                fiscalNumber: "123456789",
                type:"type1",
                license:"X",
                licenseDate:"01/02/2020"};
    
          const inputD: DriverViewDTO =
        {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: new Date("02/20/2000"),
            citizenCardNumber: "12345678",
            entryDate: new Date("01/01/2020"),
            departureDate: new Date("01/02/2020"),
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:new Date("01/02/2020")};
        
          mapperSpy.FromViewToModelDto.and.returnValue(of(driver));
          mapperSpy.FromModelToDriverMDVDto.and.returnValue(of(expectedDto));
        let x= spyOn(Driver,'create').and.returnValue(expectedD);

      const expectedResponse = new HttpErrorResponse({
        error: 'E11000 duplicate',
        status: 404,
        statusText: 'Not Found'
      });
  
      
      httpClientSpy.post.and.returnValue(throwError( expectedResponse)); // this is to prove the mocks are working because if the above mocked method fails this mock wont even be called
    
  
     
        Vservice.registerDriver(inputD).subscribe(
          (vts) => fail('expected an error, not a Driver'),
			(error) => {
				expect(error.error).toContain('E11000 duplicate');
			});
        });



});