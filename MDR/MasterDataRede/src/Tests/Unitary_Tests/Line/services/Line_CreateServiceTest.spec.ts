/**
 * Based on https://dev.to/codedivoire/how-to-mock-an-imported-typescript-class-with-jest-2g7j
*/

import { mocked } from 'ts-jest/utils';
import {Line_Repository} from '../../../../Repositories/MongoDB_Repositories/Line_Repository/Line_Repository';
import {Node_Repository} from '../../../../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository';
import {DriverType_Repository} from '../../../../Repositories/MongoDB_Repositories/DriverType_Repository/DriverType_Repository';
import {Line} from '../../../../Line/domain/Line';
import {Line_DtoMapper} from '../../../../Line/mappers/Line_DtoMapper';
import { Line_CreateService } from '../../../../Line/services/Line_CreateService';
import { VehicleType_Repository } from '../../../../Repositories/MongoDB_Repositories/VehicleType_Repository/VehicleType_Repository';

//Mock line object
jest.createMockFromModule('../../../../Line/domain/Line');

//Mock line_repo object
jest.createMockFromModule('../../../../Repositories/MongoDB_Repositories/Line_Repository/Line_Repository');

//Mock node_repo object
jest.createMockFromModule('../../../../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository');

//Mock drivertype_repo object
jest.createMockFromModule('../../../../Repositories/MongoDB_Repositories/DriverType_Repository/DriverType_Repository');

//Mock vehicletype_repo object
jest.createMockFromModule('../../../../Repositories/MongoDB_Repositories/VehicleType_Repository/VehicleType_Repository');

//Mock mapper object
jest.createMockFromModule('../../../../Line/mappers/Line_DtoMapper');


//Clear all mock implementations before each test
beforeEach(() => {
    // Clears the record of calls to the mock constructor functions and its methods
    mocked(Line.create).mockClear;
    mocked(Line_Repository).mockClear;
    mocked(Node_Repository).mockClear;
    mocked(DriverType_Repository).mockClear;
    mocked(Line_DtoMapper).mockClear;
});

describe('Create line test', () => {
    test('registerLine should create a new line (success case 1)', async () => {

        //Create fake domain object
        let l : Line_CreateService;
        l = new Object() as Line_CreateService;
        
        //terminalNode1 contains shortname
        Object.defineProperty(l,'terminalNode1',{
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'shortname',{
                    get : jest.fn(()=>"")
                });
                return o;})
        });

        //terminalNode2 contains shortname
        Object.defineProperty(l,'terminalNode2',{
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'shortname',{
                    get : jest.fn(()=>"")
                });
                return o;})
        });

        //Mock the property length of driver list
        Object.defineProperty(l,'allowedDrivers',{
            get : jest.fn(() => [])
        });

        Object.defineProperty(l,'allowedVehicles',{
            get : jest.fn(() => [])
        });

        //const spy = jest.spyOn(Line,'name','get');        If things fails, experiment with spyon

        //Mock the result of Line.create 
        //(return only matters as object L because we need to compare the size of arrays inside it)
        
        Line.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(l);
        });

        //Mock the result of LineRepository.create (result doesn't matter as well, as long as it is wrapped in the resolved Promise)
        Line_Repository.prototype.create = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve({});
        });

        //Mock the result of Node_Repository.exists to return true
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });

        //Mock the result of DriverType_Repository.exists to return an empty list
        DriverType_Repository.prototype.findListObjects= jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve([]);
        });

        //Mock the result of VehicleType_Repository.exists to return an empty list
        VehicleType_Repository.prototype.findListObjects= jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve([]);
        });

        //Mock the mapper functions
        Line_DtoMapper.mapDomain2Persistence = jest.fn().mockImplementation(() : any => {
            return undefined;
        });
        Line_DtoMapper.map2Dto_Line_Presentation = jest.fn().mockImplementation(() : any => {
            return "result";
        });

        //Run the Service with the mocks
        let serv : Line_CreateService;

        serv = new Line_CreateService(new Line_Repository({}),new Node_Repository({}),new DriverType_Repository({}), new VehicleType_Repository({}));
        const result = await serv.registerLine(undefined);

        //Assertions
        expect(mocked(Line.create).mock.calls.length).toBe(1);
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(2);
        expect(mocked(DriverType_Repository.prototype.findListObjects).mock.calls.length).toBe(1);
        expect(mocked(VehicleType_Repository.prototype.findListObjects).mock.calls.length).toBe(1);
        expect(mocked(Line_DtoMapper.map2Dto_Line_Presentation).mock.calls.length).toBe(1);
        expect(mocked(Line_DtoMapper.mapDomain2Persistence).mock.calls.length).toBe(1);
        expect(mocked(Line_Repository.prototype.create).mock.calls.length).toBe(1);

        expect(result).toBe("result");
    });

    
    test('registerLine should not create a new line (failure case 1) : domain object creation fails', async () => {
        Line.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject("failure");
        });

        //Run the Service with the mocks
        let serv : Line_CreateService;

        serv = new Line_CreateService(new Line_Repository({}),new Node_Repository({}),new DriverType_Repository({}), new VehicleType_Repository({}));
        let result;
        await serv.registerLine(undefined)
        .catch((err) => {
            result = err;
        });

        expect(mocked(Line.create).mock.calls.length).toBe(1);

        expect(result).toBe("failure");
    });

    test('registerLine should not create a new line (failure case 2) : error occurs while performing the exists query', async () => {
        //Create fake domain object
        let l : Line_CreateService;
        l = new Object() as Line_CreateService;
        
        //terminalNode1 contains shortname
        Object.defineProperty(l,'terminalNode1',{
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'shortname',{
                    get : jest.fn(()=>"")
                });
                return o;})
        });

        //Mock the result of Line.create 
        //(return only matters as object L because we need to compare the size of arrays inside it) 
        Line.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(l);
        });

        //Mock the result of Node_Repository.exists to fail
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject("failure");
        });

        //Run the Service with the mocks
        let serv : Line_CreateService;

        serv = new Line_CreateService(new Line_Repository({}),new Node_Repository({}),new DriverType_Repository({}), new VehicleType_Repository({}));
        let result;
        await serv.registerLine(undefined)
        .catch((err) => {
            result = err;
        });

        expect(mocked(Line.create).mock.calls.length).toBe(1);
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(1);

        expect(result).toBe("failure");
    });

    test('registerLine should not create a new line (failure case 3) : terminal node does not exist in the db ', async () => {
        //Create fake domain object
        let l : Line_CreateService;
        l = new Object() as Line_CreateService;
        
        //terminalNode1 contains shortname
        Object.defineProperty(l,'terminalNode1',{
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'shortname',{
                    get : jest.fn(()=>"")
                });
                return o;})
        });

        //Mock the result of Line.create 
        //(return only matters as object L because we need to compare the size of arrays inside it) 
        Line.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(l);
        });

        //Mock the result of Node_Repository.exists to return false
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(false);
        });

        //Run the Service with the mocks
        let serv : Line_CreateService;

        serv = new Line_CreateService(new Line_Repository({}),new Node_Repository({}),new DriverType_Repository({}), new VehicleType_Repository({}));
        let result;
        await serv.registerLine(undefined)
        .catch((err) => {
            result = err;
        });

        //Assertions

        expect(mocked(Line.create).mock.calls.length).toBe(1);
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(1);

        expect(result).toBeInstanceOf(Error);
    });

    test('registerLine should not create a new line (failure case 4) : error occurs while performing the findmany query', async () => {
        //Create fake domain object
        let l : Line_CreateService;
        l = new Object() as Line_CreateService;
        
        //terminalNode1 contains shortname
        Object.defineProperty(l,'terminalNode1',{
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'shortname',{
                    get : jest.fn(()=>"")
                });
                return o;})
        });

        //terminalNode2 contains shortname
        Object.defineProperty(l,'terminalNode2',{
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'shortname',{
                    get : jest.fn(()=>"")
                });
                return o;})
        });

        //Mock the property length of driver list
        Object.defineProperty(l,'allowedDrivers',{
            get : jest.fn(() => [])
        });

        //Mock the result of Line.create 
        //(return only matters as object L because we need to compare the size of arrays inside it)
        Line.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(l);
        });

        //Mock the result of Node_Repository.exists to return true
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });

        //Mock the result of DriverType_Repository.exists to return an empty list
        DriverType_Repository.prototype.findListObjects= jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject("");
        });

        //Run the Service with the mocks
        let serv : Line_CreateService;

        serv = new Line_CreateService(new Line_Repository({}),new Node_Repository({}),new DriverType_Repository({}), new VehicleType_Repository({}));
        let result;
        await serv.registerLine(undefined)
        .catch((err) => {
            result = err;
        });

        //Assertions

        expect(mocked(Line.create).mock.calls.length).toBe(1);
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(2);
        expect(mocked(DriverType_Repository.prototype.findListObjects).mock.calls.length).toBe(1);

        expect(result).toBe("");
    });


    test('registerLine should not create a new line (failure case 5) : driver type does not exist in db', async () => {
        //Create fake domain object
        let l : Line_CreateService;
        l = new Object() as Line_CreateService;
        
        //terminalNode1 contains shortname
        Object.defineProperty(l,'terminalNode1',{
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'shortname',{
                    get : jest.fn(()=>"")
                });
                return o;})
        });

        //terminalNode2 contains shortname
        Object.defineProperty(l,'terminalNode2',{
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'shortname',{
                    get : jest.fn(()=>"")
                });
                return o;})
        });

        //Mock the property length of driver list
        Object.defineProperty(l,'allowedDrivers',{
            get : jest.fn(() => [])
        });

        //Mock the result of Line.create 
        //(return only matters as object L because we need to compare the size of arrays inside it)
        Line.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(l);
        });

        //Mock the result of LineRepository.create (result doesn't matter as well, as long as it is wrapped in the resolved Promise)
        Line_Repository.prototype.create = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve({});
        });

        //Mock the result of Node_Repository.exists to return true
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });

        //Mock the result of DriverType_Repository.exists to return an empty list
        DriverType_Repository.prototype.findListObjects= jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve([1]);
        });

        //Run the Service with the mocks
        let serv : Line_CreateService;

        serv = new Line_CreateService(new Line_Repository({}),new Node_Repository({}),new DriverType_Repository({}), new VehicleType_Repository({}));
        let result;
        await serv.registerLine(undefined)
        .catch((err) => {
            result = err;
        });

        //Assertions

        expect(mocked(Line.create).mock.calls.length).toBe(1);
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(2);
        expect(mocked(DriverType_Repository.prototype.findListObjects).mock.calls.length).toBe(1);

        expect(result).toBeInstanceOf(Error);
    });

    test('registerLine should not create a new line (failure case 6) : vehicle type does not exist in db', async () => {
        //Create fake domain object
        let l : Line_CreateService;
        l = new Object() as Line_CreateService;
        
        //terminalNode1 contains shortname
        Object.defineProperty(l,'terminalNode1',{
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'shortname',{
                    get : jest.fn(()=>"")
                });
                return o;})
        });

        //terminalNode2 contains shortname
        Object.defineProperty(l,'terminalNode2',{
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'shortname',{
                    get : jest.fn(()=>"")
                });
                return o;})
        });

        //Mock the property length of driver list
        Object.defineProperty(l,'allowedDrivers',{
            get : jest.fn(() => [])
        });

        Object.defineProperty(l,'allowedVehicles',{
            get : jest.fn(() => [])
        });


        //Mock the result of Line.create 
        //(return only matters as object L because we need to compare the size of arrays inside it)
        Line.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(l);
        });

        //Mock the result of LineRepository.create (result doesn't matter as well, as long as it is wrapped in the resolved Promise)
        Line_Repository.prototype.create = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve({});
        });

        //Mock the result of Node_Repository.exists to return true
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });

        //Mock the result of DriverType_Repository. to return an empty list
        DriverType_Repository.prototype.findListObjects= jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve([]);
        });

        //Mock the result of VehicleType_Repository
        VehicleType_Repository.prototype.findListObjects= jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve([1]);
        });

        //Run the Service with the mocks
        let serv : Line_CreateService;

        serv = new Line_CreateService(new Line_Repository({}),new Node_Repository({}),new DriverType_Repository({}), new VehicleType_Repository({}));
        let result;
        await serv.registerLine(undefined)
        .catch((err) => {
            result = err;
        });

        //Assertions

        expect(mocked(Line.create).mock.calls.length).toBe(1);
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(2);
        expect(mocked(DriverType_Repository.prototype.findListObjects).mock.calls.length).toBe(1);
        expect(mocked(VehicleType_Repository.prototype.findListObjects).mock.calls.length).toBe(1);

        expect(result).toBeInstanceOf(Error);
    });

    

    test('registerLine should not create a new line (failure case 7) : line repository fails to create the line', async () => {

        //Create fake domain object
        let l : Line_CreateService;
        l = new Object() as Line_CreateService;
        
        //terminalNode1 contains shortname
        Object.defineProperty(l,'terminalNode1',{
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'shortname',{
                    get : jest.fn(()=>"")
                });
                return o;})
        });

        //terminalNode2 contains shortname
        Object.defineProperty(l,'terminalNode2',{
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'shortname',{
                    get : jest.fn(()=>"")
                });
                return o;})
        });

        //Mock the property length of driver list
        Object.defineProperty(l,'allowedDrivers',{
            get : jest.fn(() => [])
        });

        Object.defineProperty(l,'allowedVehicles',{
            get : jest.fn(() => [])
        });

        //const spy = jest.spyOn(Line,'name','get');        If things fails, experiment with spyon

        //Mock the result of Line.create 
        //(return only matters as object L because we need to compare the size of arrays inside it)
        
        Line.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(l);
        });

        //Mock the result of LineRepository.create (result doesn't matter as well, as long as it is wrapped in the resolved Promise)
        Line_Repository.prototype.create = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject("failure");
        });

        //Mock the result of Node_Repository.exists to return true
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });

        //Mock the result of DriverType_Repository.exists to return an empty list
        DriverType_Repository.prototype.findListObjects= jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve([]);
        });

        //Mock the result of VehicleType_Repository.exists to return an empty list
        VehicleType_Repository.prototype.findListObjects= jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve([]);
        });

        //Mock the mapper functions
        Line_DtoMapper.mapDomain2Persistence = jest.fn().mockImplementation(() : any => {
            return undefined;
        });
        Line_DtoMapper.map2Dto_Line_Presentation = jest.fn().mockImplementation(() : any => {
            return "result";
        });

        //Run the Service with the mocks
        let serv : Line_CreateService;

        serv = new Line_CreateService(new Line_Repository({}),new Node_Repository({}),new DriverType_Repository({}), new VehicleType_Repository({}));
        let result;
        await serv.registerLine(undefined)
        .catch((res) =>{result =res} );

        //Assertions
        expect(mocked(Line.create).mock.calls.length).toBe(1);
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(2);
        expect(mocked(DriverType_Repository.prototype.findListObjects).mock.calls.length).toBe(1);
        expect(mocked(VehicleType_Repository.prototype.findListObjects).mock.calls.length).toBe(1);
        expect(mocked(Line_DtoMapper.mapDomain2Persistence).mock.calls.length).toBe(1);
        expect(mocked(Line_Repository.prototype.create).mock.calls.length).toBe(1);

        expect(result).toBe("failure");
    });
});
