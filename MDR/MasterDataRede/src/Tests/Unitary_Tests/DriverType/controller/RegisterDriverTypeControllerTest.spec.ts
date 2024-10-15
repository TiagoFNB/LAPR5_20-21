import 'reflect-metadata';
import { Request, Response } from 'express';
import { Service, Inject, Container } from 'typedi';
import { mocked } from 'ts-jest/utils';



import RegisterDriverTypeController from '../../../../DriverType/controller/RegisterDriverTypeController';
import { RegisterDriverTypeService } from '../../../../DriverType/services/RegisterDriveTypeService';

jest.createMockFromModule('../../../../DriverType/services/RegisterDriveTypeService');


//Clear all mock implementations before each test
beforeEach(() => {
    // Clears the record of calls to the mock constructor functions and its methods
   
    mocked(RegisterDriverTypeService).mockClear;
   
});


describe('Filter function', () => {
	

	test('controller should create a new driver type (success case 1)', async () => {

			const req = {
			body: {
				key: 'key1',
				name: 'name1',
				description: 'desc'
			}
		} as Request;

		//Create a res object
		let res = require('node-mocks-http').createResponse();

		//Mock the result of RegisterDriverTypeService.registerDriverType
		RegisterDriverTypeService.prototype.registerDriverType =jest.fn().mockImplementation(() : Promise<any> => {
			return Promise.resolve({
				name: 'name1',
				description: 'desc'
			});
		});

		//Run the Controller with the mocks
		let contr = new RegisterDriverTypeController(new RegisterDriverTypeService(undefined));
		await contr.registerDriverType(req,res);

		//Assertions
		expect(mocked(RegisterDriverTypeService.prototype.registerDriverType).mock.calls.length).toBe(1);
		expect(res._getData().key).toBe(undefined); // the service returns a dto, which dont contains the key
		expect(res._getData().name).toBe('name1');
		expect(res._getData().description).toBe('desc');
		expect(res.statusCode).toBe(201);
	});

	test('controller should fail due to error in db (failure case 1)', async () => {

			const req = {
			body: {
				key: 'key1',
				name: 'name1',
				description: 'desc'
			}
		} as Request;

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

		//Mock the result of RegisterDriverTypeService.registerDriverType
		RegisterDriverTypeService.prototype.registerDriverType =jest.fn().mockImplementation(() : Promise<any> => {
			return Promise.reject(err);
		});

		//Run the Controller with the mocks
		let contr = new RegisterDriverTypeController(new RegisterDriverTypeService(undefined));
		await contr.registerDriverType(req,res);

		//Assertions
		expect(mocked(RegisterDriverTypeService.prototype.registerDriverType).mock.calls.length).toBe(1);
		expect(res._getData().failure).toBe("yes"); 
		expect(res.statusCode).toBe(422);
	});

	test('controller should fail due to error in local validation (failure case 2)', async () => {

			const req = {
			body: {
				key: 'key1',
				name: 'name1',
				description: 'desc'
			}
		} as Request;

		//Create a res object
		let res = require('node-mocks-http').createResponse();

		let err = new Object();

        Object.defineProperties(err,{
            message: {
                value:{failure : 'yes'}
            }
        });

		//Mock the result of RegisterDriverTypeService.registerDriverType
		RegisterDriverTypeService.prototype.registerDriverType =jest.fn().mockImplementation(() : Promise<any> => {
			return Promise.reject(err);
		});

		//Run the Controller with the mocks
		let contr = new RegisterDriverTypeController(new RegisterDriverTypeService(undefined));
		await contr.registerDriverType(req,res);

		//Assertions
		expect(mocked(RegisterDriverTypeService.prototype.registerDriverType).mock.calls.length).toBe(1);
		expect(res._getData().failure).toBe("yes"); 
		expect(res.statusCode).toBe(400);
	});

});