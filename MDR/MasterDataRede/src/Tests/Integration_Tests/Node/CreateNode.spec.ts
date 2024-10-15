import { mocked } from 'ts-jest/utils';
import { Node_Repository } from '../../../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository';
import RegisterNodeController from '../../../Node/controller/RegisterNodeController';
import RegisterNodeService from '../../../Node/services/RegisterNodeService';
//Mock node_repo object
jest.createMockFromModule('../../../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository');

beforeEach(() => {
	// Clears the record of calls to the mock constructor functions and its methods
	mocked(Node_Repository).mockClear;
});

describe('Integration Tests: Create node', () => {
	test('New Node should be created (success case 1)', async () => {
		// request has all valid and possible fields to sucessfully create a node

		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.exists = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(true);
		});

		let contr = new RegisterNodeController(new RegisterNodeService(new Node_Repository(undefined)));

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				key: 'node:1',
				name: 'name1',
				latitude: '10.1',
				longitude: '20.1',
				shortName: 'xp1',
				isDepot: 'yes',
				isReliefPoint: 'no',
				crewTravelTimes: '100',
				crewTravelTimeReferenceNode: 'xp2'
			}
		});

		await contr.registerNode(req, res);
		expect(res._getData().key).toBeUndefined(); // as i dont pass this field to the response even if there is one
		expect(res._getData().name).toBe('name1');
		expect(res._getData().latitude).toBe('10.1');
		expect(res._getData().longitude).toBe('20.1');
		expect(res._getData().shortName).toBe('xp1');
		expect(res._getData().isDepot).toBe('true');
		expect(res._getData().isReliefPoint).toBe('true'); // as the node is depot it is also a relief point even if i send it as false or no
		expect(res._getData().crewTravelTimes).toBe('100');
		expect(res._getData().crewTravelTimeReferenceNode).toBe('xp2');

		expect(res.statusCode).toBe(201);
	});

	test('New Node should be created (success case 2)', async () => {
		// request dont have the refence node of the crew travel time duration , i assume it refers to itself so it should be sucessfull

		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.exists = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(true);
		});

		let contr = new RegisterNodeController(new RegisterNodeService(new Node_Repository(undefined)));

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'name1',
				latitude: '10.1',
				longitude: '20.1',
				shortName: 'xp1',
				isDepot: 'yes',
				isReliefPoint: 'no',
				crewTravelTimes: '100'
			}
		});

		await contr.registerNode(req, res);
		expect(res._getData().name).toBe('name1');
		expect(res._getData().latitude).toBe('10.1');
		expect(res._getData().longitude).toBe('20.1');
		expect(res._getData().shortName).toBe('xp1');
		expect(res._getData().isDepot).toBe('true');
		expect(res._getData().isReliefPoint).toBe('true'); // as the node is depot it is also a relief point even if i send it as false or no
		expect(res._getData().crewTravelTimes).toBe('100');
		expect(res._getData().crewTravelTimeReferenceNode).toBe('xp1');

		expect(res.statusCode).toBe(201);
	});

	test('New Node should be created (success case 3)', async () => {
		// request dont have crew travel time information, it should still create it with success (i assume this time is instant if there no specification for it)

		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.exists = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(true);
		});

		let contr = new RegisterNodeController(new RegisterNodeService(new Node_Repository(undefined)));

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'name1',
				latitude: '10.1',
				longitude: '20.1',
				shortName: 'xp1',
				isDepot: 'yes',
				isReliefPoint: 'no'
			}
		});

		await contr.registerNode(req, res);
		expect(res._getData().name).toBe('name1');
		expect(res._getData().latitude).toBe('10.1');
		expect(res._getData().longitude).toBe('20.1');
		expect(res._getData().shortName).toBe('xp1');
		expect(res._getData().isDepot).toBe('true');
		expect(res._getData().isReliefPoint).toBe('true'); // as the node is depot it is also a relief point even if i send it as false or no
		expect(res._getData().crewTravelTimes).toBeUndefined();
		expect(res._getData().crewTravelTimeReferenceNode).toBeUndefined();

		expect(res.statusCode).toBe(201);
	});

	test('New Node should be created (success case 4)', async () => {
		// request dont have if the node is depot or relief point so i assume it is false and still create the node scuessfully

		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.exists = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(true);
		});

		let contr = new RegisterNodeController(new RegisterNodeService(new Node_Repository(undefined)));

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'name1',
				latitude: '10.1',
				longitude: '20.1',
				shortName: 'xp1'
			}
		});

		await contr.registerNode(req, res);
		expect(res._getData().name).toBe('name1');
		expect(res._getData().latitude).toBe('10.1');
		expect(res._getData().longitude).toBe('20.1');
		expect(res._getData().shortName).toBe('xp1');
		expect(res._getData().isDepot).toBe('false');
		expect(res._getData().isReliefPoint).toBe('false'); // as the node is depot it is also a relief point even if i send it as false or no
		expect(res._getData().crewTravelTimes).toBeUndefined();
		expect(res._getData().crewTravelTimeReferenceNode).toBeUndefined();

		expect(res.statusCode).toBe(201);
	});

	test('New Node should be created (error case 1)', async () => {
		// request dont have a required field (name)

		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.exists = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(true);
		});

		let contr = new RegisterNodeController(new RegisterNodeService(new Node_Repository(undefined)));

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				latitude: '10.1',
				longitude: '20.1',
				shortName: 'xp1',
				isDepot: 'yes',
				isReliefPoint: 'no'
			}
		});

		await contr.registerNode(req, res);

		expect(res.statusCode).toBe(400);
	});

	test('New Node should be created (error case 2)', async () => {
		// request dont have a required field (shortname)

		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.exists = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(true);
		});

		let contr = new RegisterNodeController(new RegisterNodeService(new Node_Repository(undefined)));

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'name1',
				latitude: '10.1',
				longitude: '20.1',
				isDepot: 'yes',
				isReliefPoint: 'no'
			}
		});

		await contr.registerNode(req, res);

		expect(res.statusCode).toBe(400);
	});

	test('New Node should be created (error case 3)', async () => {
		// request dont have a required field (latitude)

		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.exists = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(true);
		});

		let contr = new RegisterNodeController(new RegisterNodeService(new Node_Repository(undefined)));

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'name1',
				longitude: '20.1',
				shortName: 'xp1',
				isDepot: 'yes',
				isReliefPoint: 'no'
			}
		});

		await contr.registerNode(req, res);

		expect(res.statusCode).toBe(400);
	});

	test('New Node should be created (error case 4)', async () => {
		// request dont have a required field (longitude)

		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.exists = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(true);
		});

		let contr = new RegisterNodeController(new RegisterNodeService(new Node_Repository(undefined)));

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'name1',
				latitude: '20.1',
				shortName: 'xp1',
				isDepot: 'yes',
				isReliefPoint: 'no'
			}
		});

		await contr.registerNode(req, res);

		expect(res.statusCode).toBe(400);
	});

	test('New Node should be created (error case 5)', async () => {
		// there is already a node in the system with the same shortName

		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.reject({ driver: 'Error duplicate key' });
		});
		Node_Repository.prototype.exists = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(true);
		});

		let contr = new RegisterNodeController(new RegisterNodeService(new Node_Repository(undefined)));

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'name1',
				longitude: '20.1',
				latitude: '20.1',
				shortName: 'xp1',
				isDepot: 'yes',
				isReliefPoint: 'no'
			}
		});

		await contr.registerNode(req, res);
		expect(res.statusCode).toBe(422);
	});

	test('New Node should be created (error case 6)', async () => {
		// the  crew travel time reference node dont exist in the system

		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.exists = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.reject(false);
		});

		let contr = new RegisterNodeController(new RegisterNodeService(new Node_Repository(undefined)));

		let req = new Object();
		let res = require('node-mocks-http').createResponse();
		Object.defineProperty(req, 'body', {
			value: {
				name: 'name1',
				longitude: '20.1',
				latitude: '20.1',
				shortName: 'xp1',
				isDepot: 'yes',
				isReliefPoint: 'no',
				crewTravelTimes: '100',
				crewTravelTimeReferenceNode: 'xp2'
			}
		});

		await contr.registerNode(req, res);
		expect(res.statusCode).toBe(400);
	});
});
