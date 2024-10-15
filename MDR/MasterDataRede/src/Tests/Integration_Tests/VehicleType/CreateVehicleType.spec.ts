import { mocked } from 'ts-jest/utils';

import { VehicleType_Repository } from '../../../Repositories/MongoDB_Repositories/VehicleType_Repository/VehicleType_Repository';
import RegisterVehicleTypeController from '../../../VehicleType/controller/RegisterVehicleTypeController';
import RegisterVehicleTypeService from '../../../VehicleType/services/RegisterVehicleTypeService';
//Mock node_repo object
jest.createMockFromModule('../../../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository');

beforeEach(() => {
	// Clears the record of calls to the mock constructor functions and its methods
	mocked(VehicleType_Repository).mockClear;
});

describe('Integration Tests: Create node', () => {
	test('New vehicleType should be created (success case 1)', async () => {
		// request has all valid and possible fields to sucessfully create a vehicle type

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});

		let contr = new RegisterVehicleTypeController(
			new RegisterVehicleTypeService(new VehicleType_Repository(undefined))
		);

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				key: 'vehicleType:1',
				name: 'vehicleType1',
				autonomy: '10',
				fuelType: 'gpl',
				// unit will be calculated in runtime depending on the fuelType, it is not ignored if it is passed to req
				costPerKm: '2',
				averageSpeed: '40',
				averageConsumption: '10',
				currency: 'USD',
				description: 'description1'
			}
		});

		await contr.registerVehicleType(req, res);
		expect(res._getData().key).toBeUndefined(); // as i dont pass this field to the response even if there is one
		expect(res._getData().name).toBe('vehicleType1');
		expect(res._getData().autonomy).toBe('10');
		expect(res._getData().fuelType).toBe('gpl');
		expect(res._getData().costPerKm).toBe('2 USD'); // in the response curency is concated with the cost for a cleaner look
		expect(res._getData().averageSpeed).toBe('40');
		expect(res._getData().averageConsumption).toBe('10 l'); // the unit is concated with the consumption value, in the response, for a cleaner look
		expect(res._getData().currency).toBeUndefined(); // as the currency is concated with the cost in the response
		expect(res._getData().description).toBe('description1');

		expect(res.statusCode).toBe(201);
	});

	test('New vehicleType should be created (success case 2)', async () => {
		// request dont have key as it is an optinal parameter ()

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});

		let contr = new RegisterVehicleTypeController(
			new RegisterVehicleTypeService(new VehicleType_Repository(undefined))
		);

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'vehicleType1',
				autonomy: '10',
				fuelType: 'gpl',
				costPerKm: '2',
				averageSpeed: '40',
				averageConsumption: '10',
				currency: 'USD',
				description: 'description1'
			}
		});

		await contr.registerVehicleType(req, res);
		expect(res._getData().key).toBeUndefined(); // as i dont pass this field to the response even if there is one
		expect(res._getData().name).toBe('vehicleType1');
		expect(res._getData().autonomy).toBe('10');
		expect(res._getData().fuelType).toBe('gpl');
		expect(res._getData().costPerKm).toBe('2 USD'); // in the response curency is concated with the cost for a cleaner look
		expect(res._getData().averageSpeed).toBe('40');
		expect(res._getData().averageConsumption).toBe('10 l'); // the unit is concated with the consumption value, in the response, for a cleaner look
		expect(res._getData().currency).toBeUndefined(); // as the currency is concated with the cost in the response
		expect(res._getData().description).toBe('description1');

		expect(res.statusCode).toBe(201);
	});

	test('New vehicleType should be created (success case 3)', async () => {
		// fuel type is in code format (23)

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});

		let contr = new RegisterVehicleTypeController(
			new RegisterVehicleTypeService(new VehicleType_Repository(undefined))
		);

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'vehicleType1',
				autonomy: '10',
				fuelType: '23',
				costPerKm: '2',
				averageSpeed: '40',
				averageConsumption: '10',
				currency: 'USD',
				description: 'description1'
			}
		});

		await contr.registerVehicleType(req, res);
		expect(res._getData().key).toBeUndefined(); // as i dont pass this field to the response even if there is one
		expect(res._getData().name).toBe('vehicleType1');
		expect(res._getData().autonomy).toBe('10');
		expect(res._getData().fuelType).toBe('diesel'); // the code 23 passed in reqwuest means this fuel type is diesel
		expect(res._getData().costPerKm).toBe('2 USD'); // in the response curency is concated with the cost for a cleaner look
		expect(res._getData().averageSpeed).toBe('40');
		expect(res._getData().averageConsumption).toBe('10 l'); // the unit is concated with the consumption value, in the response, for a cleaner look
		expect(res._getData().currency).toBeUndefined(); // as the currency is concated with the cost in the response
		expect(res._getData().description).toBe('description1');

		expect(res.statusCode).toBe(201);
	});

	test('New vehicleType should be created (success case 4)', async () => {
		// currency is not specified so it should assume the cost per kilometer is in EUR

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});

		let contr = new RegisterVehicleTypeController(
			new RegisterVehicleTypeService(new VehicleType_Repository(undefined))
		);

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'vehicleType1',
				autonomy: '10',
				fuelType: '23',
				costPerKm: '2',
				averageSpeed: '40',
				averageConsumption: '10',
				description: 'description1'
			}
		});

		await contr.registerVehicleType(req, res);
		expect(res._getData().key).toBeUndefined(); // as i dont pass this field to the response even if there is one
		expect(res._getData().name).toBe('vehicleType1');
		expect(res._getData().autonomy).toBe('10');
		expect(res._getData().fuelType).toBe('diesel'); // the code 23 passed in reqwuest means this fuel type is diesel
		expect(res._getData().costPerKm).toBe('2 EUR'); // in the response curency is concated with the cost for a cleaner look
		expect(res._getData().averageSpeed).toBe('40');
		expect(res._getData().averageConsumption).toBe('10 l'); // the unit is concated with the consumption value, in the response, for a cleaner look
		expect(res._getData().currency).toBeUndefined(); // as the currency is concated with the cost in the response
		expect(res._getData().description).toBe('description1');

		expect(res.statusCode).toBe(201);
	});

	test('New vehicleType should be created (success case 5)', async () => {
		// fuel type is in code format (1)

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});

		let contr = new RegisterVehicleTypeController(
			new RegisterVehicleTypeService(new VehicleType_Repository(undefined))
		);

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'vehicleType1',
				autonomy: '10',
				fuelType: '1',
				costPerKm: '2',
				averageSpeed: '40',
				averageConsumption: '10',
				currency: 'USD',
				description: 'description1'
			}
		});

		await contr.registerVehicleType(req, res);
		expect(res._getData().key).toBeUndefined(); // as i dont pass this field to the response even if there is one
		expect(res._getData().name).toBe('vehicleType1');
		expect(res._getData().autonomy).toBe('10');
		expect(res._getData().fuelType).toBe('gasoline'); // the code 1 passed in reqwuest means this fuel type is gasoline
		expect(res._getData().costPerKm).toBe('2 USD'); // in the response curency is concated with the cost for a cleaner look
		expect(res._getData().averageSpeed).toBe('40');
		expect(res._getData().averageConsumption).toBe('10 l'); // the unit is concated with the consumption value, in the response, for a cleaner look
		expect(res._getData().currency).toBeUndefined(); // as the currency is concated with the cost in the response
		expect(res._getData().description).toBe('description1');

		expect(res.statusCode).toBe(201);
	});

	test('New vehicleType should be created (success case 6)', async () => {
		// fuel type is in code format (20)

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});

		let contr = new RegisterVehicleTypeController(
			new RegisterVehicleTypeService(new VehicleType_Repository(undefined))
		);

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'vehicleType1',
				autonomy: '10',
				fuelType: '20',
				costPerKm: '2',
				averageSpeed: '40',
				averageConsumption: '10',
				currency: 'USD',
				description: 'description1'
			}
		});

		await contr.registerVehicleType(req, res);
		expect(res._getData().key).toBeUndefined(); // as i dont pass this field to the response even if there is one
		expect(res._getData().name).toBe('vehicleType1');
		expect(res._getData().autonomy).toBe('10');
		expect(res._getData().fuelType).toBe('gpl'); // the code 20 passed in reqwuest means this fuel type is gpl
		expect(res._getData().costPerKm).toBe('2 USD'); // in the response curency is concated with the cost for a cleaner look
		expect(res._getData().averageSpeed).toBe('40');
		expect(res._getData().averageConsumption).toBe('10 l'); // the unit is concated with the consumption value, in the response, for a cleaner look
		expect(res._getData().currency).toBeUndefined(); // as the currency is concated with the cost in the response
		expect(res._getData().description).toBe('description1');

		expect(res.statusCode).toBe(201);
	});

	test('New vehicleType should be created (success case 7)', async () => {
		// fuel type is in code format (50)

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});

		let contr = new RegisterVehicleTypeController(
			new RegisterVehicleTypeService(new VehicleType_Repository(undefined))
		);

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'vehicleType1',
				autonomy: '10',
				fuelType: '50',
				costPerKm: '2',
				averageSpeed: '40',
				averageConsumption: '10',
				currency: 'USD',
				description: 'description1'
			}
		});

		await contr.registerVehicleType(req, res);
		expect(res._getData().key).toBeUndefined(); // as i dont pass this field to the response even if there is one
		expect(res._getData().name).toBe('vehicleType1');
		expect(res._getData().autonomy).toBe('10');
		expect(res._getData().fuelType).toBe('hydrogen'); // the code 50 passed in reqwuest means this fuel type is hydrogen
		expect(res._getData().costPerKm).toBe('2 USD'); // in the response curency is concated with the cost for a cleaner look
		expect(res._getData().averageSpeed).toBe('40');
		expect(res._getData().averageConsumption).toBe('10 l'); // the unit is concated with the consumption value, in the response, for a cleaner look
		expect(res._getData().currency).toBeUndefined(); // as the currency is concated with the cost in the response
		expect(res._getData().description).toBe('description1');

		expect(res.statusCode).toBe(201);
	});

	test('New vehicleType should be created (success case 8)', async () => {
		// fuel type is in code format (75)

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});

		let contr = new RegisterVehicleTypeController(
			new RegisterVehicleTypeService(new VehicleType_Repository(undefined))
		);

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'vehicleType1',
				autonomy: '10',
				fuelType: '75',
				costPerKm: '2',
				averageSpeed: '40',
				averageConsumption: '10',
				currency: 'USD',
				description: 'description1'
			}
		});

		await contr.registerVehicleType(req, res);
		expect(res._getData().key).toBeUndefined(); // as i dont pass this field to the response even if there is one
		expect(res._getData().name).toBe('vehicleType1');
		expect(res._getData().autonomy).toBe('10');
		expect(res._getData().fuelType).toBe('electric'); // the code 75 passed in reqwuest means this fuel type is electric
		expect(res._getData().costPerKm).toBe('2 USD'); // in the response curency is concated with the cost for a cleaner look
		expect(res._getData().averageSpeed).toBe('40');
		expect(res._getData().averageConsumption).toBe('10 l'); // the unit is concated with the consumption value, in the response, for a cleaner look
		expect(res._getData().currency).toBeUndefined(); // as the currency is concated with the cost in the response
		expect(res._getData().description).toBe('description1');

		expect(res.statusCode).toBe(201);
	});

	test('New vehicleType should be created (success case 8)', async () => {
		// description is not defined, shall still create with success

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});

		let contr = new RegisterVehicleTypeController(
			new RegisterVehicleTypeService(new VehicleType_Repository(undefined))
		);

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'vehicleType1',
				autonomy: '10',
				fuelType: '75',
				costPerKm: '2',
				averageSpeed: '40',
				averageConsumption: '10',
				currency: 'USD'
			}
		});

		await contr.registerVehicleType(req, res);
		expect(res._getData().key).toBeUndefined(); // as i dont pass this field to the response even if there is one
		expect(res._getData().name).toBe('vehicleType1');
		expect(res._getData().autonomy).toBe('10');
		expect(res._getData().fuelType).toBe('electric'); // the code 75 passed in reqwuest means this fuel type is electric
		expect(res._getData().costPerKm).toBe('2 USD'); // in the response curency is concated with the cost for a cleaner look
		expect(res._getData().averageSpeed).toBe('40');
		expect(res._getData().averageConsumption).toBe('10 l'); // the unit is concated with the consumption value, in the response, for a cleaner look
		expect(res._getData().currency).toBeUndefined(); // as the currency is concated with the cost in the response
		expect(res._getData().description).toBeUndefined();

		expect(res.statusCode).toBe(201);
	});

	test('New vehicleType should Not be created (error case 1)', async () => {
		// request dont have name

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});

		let contr = new RegisterVehicleTypeController(
			new RegisterVehicleTypeService(new VehicleType_Repository(undefined))
		);

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				autonomy: '10',
				fuelType: 'gpl',
				costPerKm: '2',
				averageSpeed: '40',
				averageConsumption: '10',
				currency: 'USD',
				description: 'description1'
			}
		});

		await contr.registerVehicleType(req, res);

		expect(res.statusCode).toBe(400);
	});

	test('New vehicleType should Not be created (error case 2)', async () => {
		// request dont have autonomy field

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});

		let contr = new RegisterVehicleTypeController(
			new RegisterVehicleTypeService(new VehicleType_Repository(undefined))
		);

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'vehicleType1',
				fuelType: 'gpl',
				costPerKm: '2',
				averageSpeed: '40',
				averageConsumption: '10',
				currency: 'USD',
				description: 'description1'
			}
		});

		await contr.registerVehicleType(req, res);

		expect(res.statusCode).toBe(400);
	});

	test('New vehicleType should Not be created (error case 3)', async () => {
		// request dont have fuel type field

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});

		let contr = new RegisterVehicleTypeController(
			new RegisterVehicleTypeService(new VehicleType_Repository(undefined))
		);

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'vehicleType1',
				autonomy: '10',

				costPerKm: '2',
				averageSpeed: '40',
				averageConsumption: '10',
				currency: 'USD',
				description: 'description1'
			}
		});

		await contr.registerVehicleType(req, res);

		expect(res.statusCode).toBe(400);
	});

	test('New vehicleType should Not be created (error case 4)', async () => {
		// request fuel type is invalid

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});

		let contr = new RegisterVehicleTypeController(
			new RegisterVehicleTypeService(new VehicleType_Repository(undefined))
		);

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'vehicleType1',
				autonomy: '10',
				fuelType: 'invalidtype',
				costPerKm: '2',
				averageSpeed: '40',
				averageConsumption: '10',
				currency: 'USD',
				description: 'description1'
			}
		});

		await contr.registerVehicleType(req, res);

		expect(res.statusCode).toBe(400);
	});

	test('New vehicleType should Not be created (error case 5)', async () => {
		// cost per kilometer is undefined

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});

		let contr = new RegisterVehicleTypeController(
			new RegisterVehicleTypeService(new VehicleType_Repository(undefined))
		);

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'vehicleType1',
				autonomy: '10',
				fuelType: 'invalidtype',
				averageSpeed: '40',
				averageConsumption: '10',
				currency: 'USD',
				description: 'description1'
			}
		});

		await contr.registerVehicleType(req, res);

		expect(res.statusCode).toBe(400);
	});

	test('New vehicleType should Not be created (error case 6)', async () => {
		// average speed  is undefined

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});

		let contr = new RegisterVehicleTypeController(
			new RegisterVehicleTypeService(new VehicleType_Repository(undefined))
		);

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'vehicleType1',
				autonomy: '10',
				fuelType: 'invalidtype',

				costPerKm: '2',
				averageConsumption: '10',
				currency: 'USD',
				description: 'description1'
			}
		});

		await contr.registerVehicleType(req, res);

		expect(res.statusCode).toBe(400);
	});

	test('New vehicleType should Not be created (error case 7)', async () => {
		// average consumption  is undefined

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});

		let contr = new RegisterVehicleTypeController(
			new RegisterVehicleTypeService(new VehicleType_Repository(undefined))
		);

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'vehicleType1',
				autonomy: '10',
				fuelType: 'invalidtype',
				costPerKm: '2',
				averageSpeed: '40',
				currency: 'USD',
				description: 'description1'
			}
		});

		await contr.registerVehicleType(req, res);

		expect(res.statusCode).toBe(400);
	});
});
