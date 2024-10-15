/**
 * Based on https://dev.to/codedivoire/how-to-mock-an-imported-typescript-class-with-jest-2g7j
*/

import { mocked } from 'ts-jest/utils';
import {DriverType_Repository} from '../../../../Repositories/MongoDB_Repositories/DriverType_Repository/DriverType_Repository';
import {DriverType} from '../../../../DriverType/domain/DriverType';
import { RegisterDriverTypeService } from '../../../../DriverType/services/RegisterDriveTypeService';
import { DriverTypeDTOMapper } from '../../../../DriverType/mappers/DriverTypeDTOMapper';

//Mock line object
jest.createMockFromModule('../../../../DriverType/domain/DriverType');


//Mock drivertype_repo object
jest.createMockFromModule('../../../../Repositories/MongoDB_Repositories/DriverType_Repository/DriverType_Repository');

//Mock mapper object
jest.createMockFromModule('../../../../DriverType/mappers/DriverTypeDTOMapper');


//Clear all mock implementations before each test
beforeEach(() => {
    // Clears the record of calls to the mock constructor functions and its methods
    mocked(DriverType.create).mockClear;
    mocked(DriverTypeDTOMapper).mockClear;
    mocked(DriverType_Repository).mockClear;
   
});

describe('Create DriverType test', () => {
    test('registerDriverType should create a new DriverType (success case 1)', async () => {

        //Create fake domain object
        let l : RegisterDriverTypeService;
        l = new Object() as RegisterDriverTypeService;
        
        //terminalNode1 contains shortname
        Object.defineProperty(l,'name',{
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'name',{
                    get : jest.fn(()=>"")
                });
                return o;})
        });

        
        DriverType.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(l);
        });

        DriverType_Repository.prototype.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });

        //Mock the mapper functions
        DriverTypeDTOMapper.DriverTypeMapDomain2Persistence = jest.fn().mockImplementation(() : any => {
            return undefined;
        });
        DriverTypeDTOMapper.DriverTypeMapPersistence2DTO= jest.fn().mockImplementation(() : any => {
            return "result";
        });

        //Run the Service with the mocks
        let serv : RegisterDriverTypeService;

        serv = new RegisterDriverTypeService(new DriverType_Repository({}));
        const result = await serv.registerDriverType(l);

        //Assertions
        expect(mocked(DriverType.create).mock.calls.length).toBe(1);
        expect(mocked(DriverType_Repository.prototype.create).mock.calls.length).toBe(1);
        expect(mocked(DriverTypeDTOMapper.DriverTypeMapDomain2Persistence).mock.calls.length).toBe(1);
        expect(mocked(DriverTypeDTOMapper.DriverTypeMapPersistence2DTO).mock.calls.length).toBe(1);

        expect(result).toBe("result");
    });

    

    test('registerDriverType should not create a new drivertype (failure case 1) : domain object creation fails', async () => {
        DriverType.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject("failure");
        });

        DriverTypeDTOMapper.DriverTypeMapDTO2Domain= jest.fn().mockImplementation(() : any => {
            return undefined;
        });
        //Run the Service with the mocks
        let serv : RegisterDriverTypeService;

        serv = new RegisterDriverTypeService(new DriverType_Repository({}));
        let result;
        await serv.registerDriverType(undefined)
        .catch((err) => {
            result = err;
        });
        
        expect(mocked(DriverTypeDTOMapper.DriverTypeMapDTO2Domain).mock.calls.length).toBe(1);
        expect(mocked(DriverType.create).mock.calls.length).toBe(1);

        expect(result).toBe("failure");
    });

    test('registerDriverType should not create a new drivertype (failure case 2) : error occurs while repo creates', async () => {
        //Create fake domain object
        let l : RegisterDriverTypeService;
        l = new Object() as RegisterDriverTypeService;
        
        //terminalNode1 contains shortname
        Object.defineProperty(l,'name',{
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'name',{
                    get : jest.fn(()=>"")
                });
                return o;})
        });

        DriverType.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(l);
        });

        DriverType_Repository.prototype.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject("failure");
        });

        DriverTypeDTOMapper.DriverTypeMapDTO2Domain= jest.fn().mockImplementation(() : any => {
            return undefined;
        });
        DriverTypeDTOMapper.DriverTypeMapDomain2Persistence = jest.fn().mockImplementation(() : any => {
            return undefined;
        });

        //Run the Service with the mocks
        let serv : RegisterDriverTypeService;

        serv = new RegisterDriverTypeService(new DriverType_Repository({}));
        let result;
        await serv.registerDriverType(l)
        .catch((err) => {
            result = err;
        });

        

        expect(mocked(DriverTypeDTOMapper.DriverTypeMapDTO2Domain).mock.calls.length).toBe(1);
        expect(mocked(DriverType.create).mock.calls.length).toBe(1);
        
        expect(mocked(DriverTypeDTOMapper.DriverTypeMapDomain2Persistence).mock.calls.length).toBe(1);
        expect(mocked(DriverType_Repository.prototype.create).mock.calls.length).toBe(1);
        

        expect(result).toBe("failure");
    });

   

});
