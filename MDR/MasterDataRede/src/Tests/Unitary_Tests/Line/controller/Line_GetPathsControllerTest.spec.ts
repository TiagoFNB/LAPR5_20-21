import { mocked } from 'ts-jest/utils';
import { Line_GetPathsService } from '../../../../Line/services/Line_GetPathsService';
import { Line_GetPathsController } from '../../../../Line/controller/Line_GetPathsController';

//Mock Line_CreateService object
jest.createMockFromModule('../../../../Line/services/Line_GetPathsService');

//Clear all mock implementations before each test
beforeEach(() => {
    // Clears the record of calls to the mock constructor functions and its methods
    mocked(Line_GetPathsService.prototype.getPathsService).mockClear;
});

describe('Create line controller test', () => {
    test('controller should create a new line (success case 1)', async () => {
        //Define a req object simulation
        let req = new Object();

        Object.defineProperty(req,"params", {
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'key',{
                    get : jest.fn(()=>"")
                });
                return o;})
        });

        //Create a res object
        let res = require('node-mocks-http').createResponse();



        //Mock the result of Line_CreateService.registerLine
        Line_GetPathsService.prototype.getPathsService =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve({success:''});
        });

        //Run the Controller with the mocks
        let contr = new Line_GetPathsController(new Line_GetPathsService(undefined,undefined));
        await contr.getPaths(req,res);

        //Assertions
        expect(mocked(Line_GetPathsService.prototype.getPathsService).mock.calls.length).toBe(1);
        expect(res._getData().success).toBe('');
        expect(res.statusCode).toBe(200);
    });

    test('controller should not create a new line: error comes from the database (failure case 1)', async () => {
        //Define a req object simulation
        let req = new Object();

        Object.defineProperty(req,"params", {
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'key',{
                    get : jest.fn(()=>"")
                });
                return o;})
        });

        //Create a res object
        let res = require('node-mocks-http').createResponse();

        let err = new Object();

        Object.defineProperties(err,{
            driver: {
                value:true
            },
            message: {
                value:{failure : 'yes'}
            }
        });

        //Mock the result of Line_CreateService.registerLine
        Line_GetPathsService.prototype.getPathsService =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject(err);
        });

        //Run the Controller with the mocks
        let contr = new Line_GetPathsController(new Line_GetPathsService(undefined,undefined));
        await contr.getPaths(req,res);

        //Assertions
        expect(mocked(Line_GetPathsService.prototype.getPathsService).mock.calls.length).toBe(1);
        expect(res._getData().failure).toBe("yes");
        expect(res.statusCode).toBe(422);
        
    });

    test('controller should not create a new line: error comes from a local validation (failure case 2)', async () => {
        //Define a req object simulation
        let req = new Object();

        Object.defineProperty(req,"params", {
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'key',{
                    get : jest.fn(()=>"")
                });
                return o;})
        });

        //Create a res object
        let res = require('node-mocks-http').createResponse();

        let err = new Object();

        Object.defineProperties(err,{
            message: {
                value:{failure : 'yes'}
            }
        });

        //Mock the result of Line_CreateService.registerLine
        Line_GetPathsService.prototype.getPathsService =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject(err);
        });

        //Run the Controller with the mocks
        let contr = new Line_GetPathsController(new Line_GetPathsService(undefined,undefined));
        await contr.getPaths(req,res);

        //Assertions
        expect(mocked( Line_GetPathsService.prototype.getPathsService).mock.calls.length).toBe(1);
        expect(res._getData().failure).toBe("yes");
        expect(res.statusCode).toBe(400);
        
    });
});