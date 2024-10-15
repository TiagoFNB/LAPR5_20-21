import { mocked } from 'ts-jest/utils';
import { Node_Repository } from '../../../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository';
import ObtainNodeListByQueryController from '../../../Node/controller/ObtainNodeListByQueryController';
import ObtainNodeService from '../../../Node/services/ObtainNodeService';

//Mock node_repo object
//const url = require('url');
import { Request } from 'express';

jest.createMockFromModule('../../../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository');

beforeEach(() => {
	// Clears the record of calls to the mock constructor functions and its methods
	mocked(Node_Repository).mockClear;
});

describe('Integration Tests: Create node', () => {
	test('Should  return a list of nodes  (success case 1)', async () => {
		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([
				{
					name: 'node1',
					shortName: 'sh1',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				}
			]);
		});

		let contr = new ObtainNodeListByQueryController(new ObtainNodeService(new Node_Repository(undefined)));

		let res = require('node-mocks-http').createResponse();

		const request = {
			url: '/listByQuery?filterby=shortName&filtertype=s&sortby=name'
		} as Request;

		await contr.listNodesByShortNameOrName(request, res);
		expect(res._getData()[0].name).toBe('node1');
		expect(res._getData()[1]).toBeUndefined();
		expect(res.statusCode).toBe(200);
	});

	test('Should  return a list of nodes  (success case 2)', async () => {
		//now i filter by name and sort by shortName
		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([
				{
					name: 'pode1',
					shortName: 'sh1',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				},
				{
					name: 'pode2',
					shortName: 'sh2',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				}
			]);
		});

		let contr = new ObtainNodeListByQueryController(new ObtainNodeService(new Node_Repository(undefined)));

		let res = require('node-mocks-http').createResponse();

		const request = {
			url: '/listByQuery?filterby=name&filtertype=p&sortby=shortName'
		} as Request;

		await contr.listNodesByShortNameOrName(request, res);

		expect(res._getData()[0].name).toBe('pode1');
		expect(res._getData()[0].shortName).toBe('sh1');
		expect(res._getData()[1].shortName).toBe('sh2');
		expect(res._getData()[1].name).toBe('pode2');

		expect(res.statusCode).toBe(200);
	});

	test('Should  return a list of nodes  (success case 3)', async () => {
		//now it filters without sort
		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([
				{
					name: 'node1',
					shortName: 'sh1',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				},
				{
					name: 'node2',
					shortName: 'sh2',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				}
			]);
		});

		let contr = new ObtainNodeListByQueryController(new ObtainNodeService(new Node_Repository(undefined)));

		let res = require('node-mocks-http').createResponse();

		const request = {
			url: '/listByQuery?filterby=name&filtertype=n'
		} as Request;

		await contr.listNodesByShortNameOrName(request, res);

		expect(res._getData()[0].name).toBe('node1');
		expect(res._getData()[0].shortName).toBe('sh1');
		expect(res._getData()[1].shortName).toBe('sh2');
		expect(res._getData()[1].name).toBe('node2');

		expect(res.statusCode).toBe(200);
	});

	test('Should  return a list of nodes  (success case 4)', async () => {
		//now it sorts without filter
		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([
				{
					name: 'node1',
					shortName: 'sh1',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				},
				{
					name: 'node2',
					shortName: 'sh2',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				}
			]);
		});

		let contr = new ObtainNodeListByQueryController(new ObtainNodeService(new Node_Repository(undefined)));

		let res = require('node-mocks-http').createResponse();

		const request = {
			url: '/listByQuery?sortby=shortName'
		} as Request;

		await contr.listNodesByShortNameOrName(request, res);

		expect(res._getData()[0].name).toBe('node1');
		expect(res._getData()[0].shortName).toBe('sh1');
		expect(res._getData()[1].shortName).toBe('sh2');
		expect(res._getData()[1].name).toBe('node2');

		expect(res.statusCode).toBe(200);
	});

	test('Should  return a list of nodes (success case 5)', async () => {
		//now it sorts without filter
		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([
				{
					name: 'node1',
					shortName: 'sh1',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				},
				{
					name: 'node2',
					shortName: 'sh2',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				}
			]);
		});

		let contr = new ObtainNodeListByQueryController(new ObtainNodeService(new Node_Repository(undefined)));

		let res = require('node-mocks-http').createResponse();

		const request = {
			url: '/listByQuery?sortby=shortName'
		} as Request;

		await contr.listNodesByShortNameOrName(request, res);

		expect(res._getData()[0].name).toBe('node1');
		expect(res._getData()[0].shortName).toBe('sh1');
		expect(res._getData()[1].shortName).toBe('sh2');
		expect(res._getData()[1].name).toBe('node2');

		expect(res.statusCode).toBe(200);
	});

	test('Should Not return a list of nodes (error case 1)', async () => {
		//now the url have an incomplete filter ( lacks filter type)
		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([
				{
					name: 'node1',
					shortName: 'sh1',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				},
				{
					name: 'node2',
					shortName: 'sh2',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				}
			]);
		});

		let contr = new ObtainNodeListByQueryController(new ObtainNodeService(new Node_Repository(undefined)));

		let res = require('node-mocks-http').createResponse();

		const request = {
			url: '/listByQuery?filterby=name&sortby=shortName'
		} as Request;

		await contr.listNodesByShortNameOrName(request, res);

		expect(res.statusCode).toBe(400);
	});

	test('Should Not return a list of nodes (error case 2)', async () => {
		//now the url have an incomplete filter ( lacks filter by)
		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([
				{
					name: 'node1',
					shortName: 'sh1',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				},
				{
					name: 'node2',
					shortName: 'sh2',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				}
			]);
		});

		let contr = new ObtainNodeListByQueryController(new ObtainNodeService(new Node_Repository(undefined)));

		let res = require('node-mocks-http').createResponse();

		const request = {
			url: '/listByQuery?filtertype=p&sortby=shortName'
		} as Request;

		await contr.listNodesByShortNameOrName(request, res);

		expect(res.statusCode).toBe(400);
	});

	test('Should Not return a list of nodes (error case 2)', async () => {
		//now the url have an invalid filter ( can only filter by name or shortName)
		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([
				{
					name: 'node1',
					shortName: 'sh1',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				},
				{
					name: 'node2',
					shortName: 'sh2',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				}
			]);
		});

		let contr = new ObtainNodeListByQueryController(new ObtainNodeService(new Node_Repository(undefined)));

		let res = require('node-mocks-http').createResponse();

		const request = {
			url: '/listByQuery?filterby=nameS&filtertype=p&sortby=shortName'
		} as Request;

		await contr.listNodesByShortNameOrName(request, res);

		expect(res.statusCode).toBe(400);
	});

	test('Should Not return a list of nodes (error case 2)', async () => {
		//now the url have an invalid filter ( can only sort by name or shortName)
		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([
				{
					name: 'node1',
					shortName: 'sh1',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				},
				{
					name: 'node2',
					shortName: 'sh2',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				}
			]);
		});

		let contr = new ObtainNodeListByQueryController(new ObtainNodeService(new Node_Repository(undefined)));

		let res = require('node-mocks-http').createResponse();

		const request = {
			url: '/listByQuery?filterby=name&filtertype=p&sortby=shortNameS'
		} as Request;

		await contr.listNodesByShortNameOrName(request, res);

		expect(res.statusCode).toBe(400);
	});

	test('Should Not return a list of nodes (error case 2)', async () => {
		//now the url dont have any fields (sortby, filterby, filtertype)
		Node_Repository.prototype.create = jest.fn().mockImplementation((object): Promise<any> => {
			return Promise.resolve(object);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([
				{
					name: 'node1',
					shortName: 'sh1',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				},
				{
					name: 'node2',
					shortName: 'sh2',
					coordinates: {
						latitude: '10',
						longitude: '10'
					},

					isDepot: 'true',
					isReliefPoint: 'true'
				}
			]);
		});

		let contr = new ObtainNodeListByQueryController(new ObtainNodeService(new Node_Repository(undefined)));

		let res = require('node-mocks-http').createResponse();

		const request = {
			url: '/listByQuery?randomurl'
		} as Request;

		await contr.listNodesByShortNameOrName(request, res);

		expect(res.statusCode).toBe(400);
	});
});
