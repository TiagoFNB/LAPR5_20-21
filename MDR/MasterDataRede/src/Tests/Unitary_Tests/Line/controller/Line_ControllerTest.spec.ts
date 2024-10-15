import { mocked } from 'ts-jest/utils';
import { Line_CreateService } from '../../../../Line/services/Line_CreateService';
import { Line_Controller } from '../../../../Line/controller/Line_Controller';

//Mock Line_CreateService object
jest.createMockFromModule('../../../../Line/services/Line_CreateService');

//Clear all mock implementations before each test
beforeEach(() => {
    // Clears the record of calls to the mock constructor functions and its methods
    mocked(Line_CreateService.prototype.registerLine).mockClear;
});

describe('Create line controller test', () => {
    test('controller should create a new line (success case 1)', async () => {
        //Define a req object simulation
        let req = new Object();

        Object.defineProperty(req,"body", {
            value: ""
        });

        //Create a res object
        let res = require('node-mocks-http').createResponse();



        //Mock the result of Line_CreateService.registerLine
        Line_CreateService.prototype.registerLine =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve({success:''});
        });

        //Run the Controller with the mocks
        let contr = new Line_Controller(new Line_CreateService(undefined,undefined,undefined, undefined));
        await contr.registerLine(req,res);

        //Assertions
        expect(mocked(Line_CreateService.prototype.registerLine).mock.calls.length).toBe(1);
        expect(res._getData().success).toBe('');
        expect(res.statusCode).toBe(201);
    });

    test('controller should not create a new line: error comes from the database (failure case 1)', async () => {
        //Define a req object simulation
        let req = new Object();

        Object.defineProperty(req,"body", {
            value: ""
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
        Line_CreateService.prototype.registerLine =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject(err);
        });

        //Run the Controller with the mocks
        let contr = new Line_Controller(new Line_CreateService(undefined,undefined,undefined, undefined));
        await contr.registerLine(req,res);

        //Assertions
        expect(mocked(Line_CreateService.prototype.registerLine).mock.calls.length).toBe(1);
        expect(res._getData().failure).toBe("yes");
        expect(res.statusCode).toBe(422);
        
    });

    test('controller should not create a new line: error comes from a local validation (failure case 2)', async () => {
        //Define a req object simulation
        let req = new Object();

        Object.defineProperty(req,"body", {
            value: ""
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
        Line_CreateService.prototype.registerLine =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject(err);
        });

        //Run the Controller with the mocks
        let contr = new Line_Controller(new Line_CreateService(undefined,undefined,undefined, undefined));
        await contr.registerLine(req,res);

        //Assertions
        expect(mocked(Line_CreateService.prototype.registerLine).mock.calls.length).toBe(1);
        expect(res._getData().failure).toBe("yes");
        expect(res.statusCode).toBe(400);
        
    });
});