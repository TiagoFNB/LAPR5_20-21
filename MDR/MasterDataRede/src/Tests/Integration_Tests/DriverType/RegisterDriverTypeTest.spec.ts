import { mocked } from 'ts-jest/utils';
import RegisterDriverTypeController from '../../../DriverType/controller/RegisterDriverTypeController';
import { RegisterDriverTypeService } from '../../../DriverType/services/RegisterDriveTypeService';
import { Request, Response } from 'express';
import { DriverType_Repository } from '../../../Repositories/MongoDB_Repositories/DriverType_Repository/DriverType_Repository';



//Mock no
jest.createMockFromModule('../../../Repositories/MongoDB_Repositories/DriverType_Repository/DriverType_Repository');

//Clear all mock implementations before each test
beforeEach(() => {
    // Clears the record of calls to the mock constructor functions and its methods

    mocked(DriverType_Repository).mockClear;

});

describe('Integration Tests: Create Driver Type', () => {
    test('New DriverType should be created (success case 1)', async () => {

        //Mock the result of LineRepository.create (result doesn't matter as well, as long as it is wrapped in the resolved Promise)
        DriverType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
            return Promise.resolve(object);
        });

        let res = require('node-mocks-http').createResponse();

        const req = {
			body: {
				key: 'key1',
				name: 'COND1',
				description: 'First Class'
			}
		} as Request;

      
        let ctrl = new RegisterDriverTypeController(new RegisterDriverTypeService(new DriverType_Repository(undefined)));
        await ctrl.registerDriverType(req, res);

        expect(res._getData().name).toBe('COND1');
        expect(res._getData().description).toBe('First Class');

        expect(res.statusCode).toBe(201);
    });

    test('New DriverType should be created without the key parameter (its optional in our case) (success case 2)', async () => {

        //Mock the result of LineRepository.create (result doesn't matter as well, as long as it is wrapped in the resolved Promise)
        DriverType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
            return Promise.resolve(object);
        });

        let res = require('node-mocks-http').createResponse();

        const req = {
			body: {
				name: 'COND1',
				description: 'First Class'
			}
		} as Request;

      
        let ctrl = new RegisterDriverTypeController(new RegisterDriverTypeService(new DriverType_Repository(undefined)));
        await ctrl.registerDriverType(req, res);

        expect(res._getData().name).toBe('COND1');
        expect(res._getData().description).toBe('First Class');

        expect(res.statusCode).toBe(201);
    });


    test('New DriverType should not be created - duplicate key (in this case its the name) in database (fail case 1)', async () => {

        //Mock the result of LineRepository.create (result doesn't matter as well, as long as it is wrapped in the resolved Promise)
        DriverType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
            return Promise.reject({driver : 'Error duplicate key (name)'});
        });

        let res = require('node-mocks-http').createResponse();

        const req = {
			body: {
				name: 'COND1',
				description: 'First Class'
			}
		} as Request;

      
        let ctrl = new RegisterDriverTypeController(new RegisterDriverTypeService(new DriverType_Repository(undefined)));
        await ctrl.registerDriverType(req, res);

     

        expect(res.statusCode).toBe(422);
    });

    test('New DriverType should not be created - name is required  (fail case 2)', async () => {

       

        let res = require('node-mocks-http').createResponse();

        const req = {
			body: {
				
				description: 'First Class'
			}
		} as Request;

      
        let ctrl = new RegisterDriverTypeController(new RegisterDriverTypeService(new DriverType_Repository(undefined)));
        await ctrl.registerDriverType(req, res);

     

        expect(res.statusCode).toBe(400);
    });

    test('New DriverType should not be created - description is required  (fail case 3)', async () => {

        

        let res = require('node-mocks-http').createResponse();

        const req = {
			body: {
				name: 'COND1',
				
			}
		} as Request;

      
        let ctrl = new RegisterDriverTypeController(new RegisterDriverTypeService(new DriverType_Repository(undefined)));
        await ctrl.registerDriverType(req, res);

     

        expect(res.statusCode).toBe(400);
    });

    test('New DriverType should not be created - name is longer than 20 chars  (fail case 4)', async () => {

      

        let res = require('node-mocks-http').createResponse();

        const req = {
			body: {
				name: 'name1name2name3name4name5',
				description: 'First Class'
			}
		} as Request;

      
        let ctrl = new RegisterDriverTypeController(new RegisterDriverTypeService(new DriverType_Repository(undefined)));
        await ctrl.registerDriverType(req, res);

     

        expect(res.statusCode).toBe(400);
    });

    test('New DriverType should not be created - desc is longer than 250 chars  (fail case 5)', async () => {

     

        let res = require('node-mocks-http').createResponse();

        const req = {
			body: {
				name: 'name1name2',
				description: '#'.repeat(300)
			}
		} as Request;

      
        let ctrl = new RegisterDriverTypeController(new RegisterDriverTypeService(new DriverType_Repository(undefined)));
        await ctrl.registerDriverType(req, res);

     

        expect(res.statusCode).toBe(400);
    });



});