import { mocked } from 'ts-jest/utils';
import Path_Controller from '../../../../Path/controller/Path_Controller';
import { Path_CreateService } from '../../../../Path/services/Path_CreateService';
describe('Filter function', () => {
	test('Controller should create a new path (success case 1)', async () => {
		//Define a req object simulation
		let req = new Object();

		Object.defineProperty(req, 'body', {
			value: ''
		});

		//Create a res object
        // let res = {key:'pathTest1'};
        // let res  = require('node-mocks-http').createRequest({
        //     method: 'GET',
        //     url: '/api/path/register',
        //     params: {
        //       key: 'pathTest1'
        //     }
        // });

        // let obj = {
        //     key: "newPathTest1",
        //     line: "line1",
        //     type: "Go",
        //     pathSegments: [
        //         {
        //         node1: "lab1",
        //         node2: "lab2",
        //         duration: 50,
        //         distance: 100
        //         }
        //     ]
        //  }

        let res = require('node-mocks-http').createResponse();
		//Mock the result of Path_CreateService.registerPath
		Path_CreateService.prototype.registerPath = jest.fn().mockImplementation((): Promise<any> => {
            // return Promise.resolve({ key: 'pathTest1'});
            return Promise.resolve({success:''});
		});

		//Run the Controller with the mocks
		let contr = new Path_Controller(new Path_CreateService(undefined, undefined, undefined));
		await contr.registerPath(req, res);

		//Assertions
		expect(mocked(Path_CreateService.prototype.registerPath).mock.calls.length).toBe(1);
		expect(res._getData().success).toBe('');
		expect(res.statusCode).toBe(201);
	});

	test('controller should Not create a new path (error case 1)', async () => {
		//Define a req object simulation
		let req = new Object();

		Object.defineProperty(req, 'body', {
			value: ''
		});

		//Create a res object
		let res = require('node-mocks-http').createResponse();

		//defining the err object, this is the object that the service will return to the controller
		let err = new Object();

		Object.defineProperties(err, {
			driver: {
				value: true
			},
			message: {
				value: { Error: 'error test 2' }
			}
		});

		//Mock the result of Line_CreateService.registerLine
		Path_CreateService.prototype.registerPath = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.reject(err);
		});

		//Run the Controller with the mocks
		let contr = new Path_Controller(new Path_CreateService(undefined,undefined,undefined));

		await contr.registerPath(req, res);

		//Assertions
		expect(mocked(Path_CreateService.prototype.registerPath).mock.calls.length).toBe(1);
		expect(res._getData().Error).toBe('error test 2');
		expect(res.statusCode).toBe(422); // status code 422 becouse the error returned by the service has a driver field, in real scenario it means it came from the DB, always becouse of duplicated identity or other restriction
	});

	test('controller should Not create a new path (error case 2)', async () => {
		//Define a req object simulation
		let req = new Object();

		Object.defineProperty(req, 'body', {
			value: ''
		});

		//Create a res object
		let res = require('node-mocks-http').createResponse();

		//defining the err object, this is the object that the service will return to the controller
		let err = new Object();

		Object.defineProperties(err, {
			message: {
				value: { Error: 'error test 3' }
			}
		});

		//Mock the result of Line_CreateService.registerLine
		Path_CreateService.prototype.registerPath = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.reject(err);
		});

		//Run the Controller with the mocks
		let contr = new Path_Controller(new Path_CreateService(undefined,undefined,undefined));

		await contr.registerPath(req, res);

		//Assertions
		expect(mocked(Path_CreateService.prototype.registerPath).mock.calls.length).toBe(1);
		expect(res._getData().Error).toBe('error test 3');
		expect(res.statusCode).toBe(400); // status code 400 becouse the error dont ontain the drive field, so we know the error is not from mongoose ( database)
	});
});
