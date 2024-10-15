import { mocked } from 'ts-jest/utils';
import RegisterVehicleTypeService from '../../../../VehicleType/services/RegisterVehicleTypeService';
import RegisterVehicleTypeController from '../../../../VehicleType/controller/RegisterVehicleTypeController';
describe('Filter function', () => {
	test('controller should create a new vehicleType (success case 1)', async () => {
		//Define a req object simulation
		let req = new Object();

		Object.defineProperty(req, 'body', {
			value: ''
		});

		//Create a res object
		let res = require('node-mocks-http').createResponse();

		//Mock the result of Line_CreateService.registerLine
		RegisterVehicleTypeService.prototype.registerVehicleType = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve({ name: 'test1' });
		});

		//Run the Controller with the mocks
		let contr = new RegisterVehicleTypeController(new RegisterVehicleTypeService(undefined));
		await contr.registerVehicleType(req, res);

		//Assertions
		expect(mocked(RegisterVehicleTypeService.prototype.registerVehicleType).mock.calls.length).toBe(1);
		expect(res._getData().name).toBe('test1');
		expect(res.statusCode).toBe(201);
	});

	test('controller should Not succeed (error case 1)', async () => {
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
		RegisterVehicleTypeService.prototype.registerVehicleType = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.reject(err);
		});

		//Run the Controller with the mocks
		let contr = new RegisterVehicleTypeController(new RegisterVehicleTypeService(undefined));

		await contr.registerVehicleType(req, res);

		//Assertions
		expect(mocked(RegisterVehicleTypeService.prototype.registerVehicleType).mock.calls.length).toBe(1);
		expect(res._getData().Error).toBe('error test 3');
		expect(res.statusCode).toBe(400); // status code 400 becouse the error dont ontain the drive field, so we know the error is not from mongoose ( database)
	});

	test('controller should Not succeed (error case 1)', async () => {
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
				value: { Error: 'error test 3' }
			}
		});

		//Mock the result of Line_CreateService.registerLine
		RegisterVehicleTypeService.prototype.registerVehicleType = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.reject(err);
		});

		//Run the Controller with the mocks
		let contr = new RegisterVehicleTypeController(new RegisterVehicleTypeService(undefined));

		await contr.registerVehicleType(req, res);

		//Assertions
		expect(mocked(RegisterVehicleTypeService.prototype.registerVehicleType).mock.calls.length).toBe(1);
		expect(res._getData().Error).toBe('error test 3');
		expect(res.statusCode).toBe(422); // status code 400 becouse the error dont ontain the drive field, so we know the error is not from mongoose ( database)
	});
});
