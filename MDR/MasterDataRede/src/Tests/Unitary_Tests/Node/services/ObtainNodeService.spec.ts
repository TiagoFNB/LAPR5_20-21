import { mocked } from 'ts-jest/utils';

import { Node_Repository } from '../../../../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository';
import { Node } from '../../../../Node/domain/Node';
import { Node_DtoMapper } from '../../../../Node/mappers/Node_DtoMapper';
import ObtainNodeService from '../../../../Node/services/ObtainNodeService';

//Mock line object
jest.createMockFromModule('../../../../Node/domain/Node');

//Mock node_repo object
jest.createMockFromModule('../../../../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository');

//Mock mapper object
jest.createMockFromModule('../../../../Node/mappers/Node_DtoMapper');

//Clear all mock implementations before each test
beforeEach(() => {
	// Clears the record of calls to the mock constructor functions and its methods
	mocked(Node.create).mockClear;
	mocked(Node_Repository).mockClear;
	mocked(Node_DtoMapper).mockClear;
});

describe('List nodes test', () => {
	test('should list nodes with sucess  (success case 1)', async () => {
		let l = new Object();

		Object.defineProperty(l, 'filterby', {
			get: jest.fn(() => 'name')
		});
		Object.defineProperty(l, 'filtertype', {
			get: jest.fn(() => 'name')
		});

		Object.defineProperty(l, 'sortby', {
			get: jest.fn(() => 'name')
		});

		Node.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(l);
		});

		//Mock the result of Node_Repository.exists to return true
		Node_Repository.prototype.exists = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([ {}, {} ]);
		});

		//Mock the mapper functions

		Node_DtoMapper.map2DTO = jest.fn().mockImplementation((): any => {
			return { name: 'node' };
		});

		Node_DtoMapper.mapFromPersistence2Domain = jest.fn().mockImplementation((): any => {
			return 'result';
		});

		//Run the Service with the mocks
		let serv: ObtainNodeService;

		serv = new ObtainNodeService(new Node_Repository({}));
		const result = await serv.listNodesByShortNameOrName(l);

		//Assertions
		expect(mocked(Node.create).mock.calls.length).toBe(2); // it calls it 2 times as i get 2 nodes from database (mock)

		expect(mocked(Node_DtoMapper.mapFromPersistence2Domain).mock.calls.length).toBe(2);
		expect(mocked(Node_DtoMapper.map2DTO).mock.calls.length).toBe(2);

		expect(result[0]).toStrictEqual({ name: 'node' });
		expect(result[1]).toStrictEqual({ name: 'node' });
	});
	test(' should list nodes with sucess  (success case 2)', async () => {
		let l = new Object();

		Object.defineProperty(l, 'filterby', {
			get: jest.fn(() => 'shortName')
		});
		Object.defineProperty(l, 'filtertype', {
			get: jest.fn(() => 'shortName')
		});

		Object.defineProperty(l, 'sortby', {
			get: jest.fn(() => 'shortName')
		});

		Node.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(l);
		});

		//Mock the result of Node_Repository.exists to return true
		Node_Repository.prototype.exists = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([ {}, {} ]);
		});

		//Mock the mapper functions

		Node_DtoMapper.map2DTO = jest.fn().mockImplementation((): any => {
			return { name: 'node' };
		});

		Node_DtoMapper.mapFromPersistence2Domain = jest.fn().mockImplementation((): any => {
			return 'result';
		});

		//Run the Service with the mocks
		let serv: ObtainNodeService;

		serv = new ObtainNodeService(new Node_Repository({}));
		const result = await serv.listNodesByShortNameOrName(l);

		//Assertions
		expect(mocked(Node.create).mock.calls.length).toBe(2); // it calls it 2 times as i get 2 nodes from database (mock)

		expect(mocked(Node_DtoMapper.mapFromPersistence2Domain).mock.calls.length).toBe(2);
		expect(mocked(Node_DtoMapper.map2DTO).mock.calls.length).toBe(2);

		expect(result[0]).toStrictEqual({ name: 'node' });
		expect(result[1]).toStrictEqual({ name: 'node' });
	});

	test(' should list nodes with sucess  (success case 3)', async () => {
		// filter is not defined but sort is
		let l = new Object();

		Object.defineProperty(l, 'filterby', {
			get: jest.fn(() => undefined)
		});
		Object.defineProperty(l, 'filtertype', {
			get: jest.fn(() => undefined)
		});

		Object.defineProperty(l, 'sortby', {
			get: jest.fn(() => 'shortName')
		});

		Node.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(l);
		});

		//Mock the result of Node_Repository.exists to return true
		Node_Repository.prototype.exists = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([ {}, {} ]);
		});

		//Mock the mapper functions

		Node_DtoMapper.map2DTO = jest.fn().mockImplementation((): any => {
			return { name: 'node' };
		});

		Node_DtoMapper.mapFromPersistence2Domain = jest.fn().mockImplementation((): any => {
			return 'result';
		});

		//Run the Service with the mocks
		let serv: ObtainNodeService;

		serv = new ObtainNodeService(new Node_Repository({}));
		const result = await serv.listNodesByShortNameOrName(l);

		//Assertions
		expect(mocked(Node.create).mock.calls.length).toBe(2); // it calls it 2 times as i get 2 nodes from database (mock)

		expect(mocked(Node_DtoMapper.mapFromPersistence2Domain).mock.calls.length).toBe(2);
		expect(mocked(Node_DtoMapper.map2DTO).mock.calls.length).toBe(2);

		expect(result[0]).toStrictEqual({ name: 'node' });
		expect(result[1]).toStrictEqual({ name: 'node' });
	});

	test(' should list nodes with sucess  (success case 4)', async () => {
		// sortby is not defined but filter is
		let l = new Object();

		Object.defineProperty(l, 'filterby', {
			get: jest.fn(() => 'shortName')
		});
		Object.defineProperty(l, 'filtertype', {
			get: jest.fn(() => 'shortName')
		});

		Object.defineProperty(l, 'sortby', {
			get: jest.fn(() => undefined)
		});

		Node.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(l);
		});

		//Mock the result of Node_Repository.exists to return true
		Node_Repository.prototype.exists = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([ {}, {} ]);
		});

		//Mock the mapper functions

		Node_DtoMapper.map2DTO = jest.fn().mockImplementation((): any => {
			return { name: 'node' };
		});

		Node_DtoMapper.mapFromPersistence2Domain = jest.fn().mockImplementation((): any => {
			return 'result';
		});

		//Run the Service with the mocks
		let serv: ObtainNodeService;

		serv = new ObtainNodeService(new Node_Repository({}));
		const result = await serv.listNodesByShortNameOrName(l);

		//Assertions
		expect(mocked(Node.create).mock.calls.length).toBe(2); // it calls it 2 times as i get 2 nodes from database (mock)

		expect(mocked(Node_DtoMapper.mapFromPersistence2Domain).mock.calls.length).toBe(2);
		expect(mocked(Node_DtoMapper.map2DTO).mock.calls.length).toBe(2);

		expect(result[0]).toStrictEqual({ name: 'node' });
		expect(result[1]).toStrictEqual({ name: 'node' });
	});

	test(' should Not list nodes with sucess  (error case 1)', async () => {
		// should fail becouse filterby is not required
		let l = new Object();

		Object.defineProperty(l, 'filterby', {
			get: jest.fn(() => 'InvalidName')
		});
		Object.defineProperty(l, 'filtertype', {
			get: jest.fn(() => 'shortName')
		});

		Object.defineProperty(l, 'sortby', {
			get: jest.fn(() => 'shortName')
		});

		Node.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(l);
		});

		//Mock the result of Node_Repository.exists to return true
		Node_Repository.prototype.exists = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([ {}, {} ]);
		});

		//Mock the mapper functions

		Node_DtoMapper.map2DTO = jest.fn().mockImplementation((): any => {
			return { name: 'node' };
		});

		Node_DtoMapper.mapFromPersistence2Domain = jest.fn().mockImplementation((): any => {
			return 'result';
		});

		//Run the Service with the mocks
		let serv: ObtainNodeService;

		serv = new ObtainNodeService(new Node_Repository({}));

		let error;
		await serv.listNodesByShortNameOrName(l).catch((err) => {
			error = err;
		});
		expect(error).toBeDefined(); // error is defined becouse of the catch above
		expect(mocked(Node.create).mock.calls.length).toBe(0); // it calls nothing as service trows an error at begining

		expect(mocked(Node_DtoMapper.mapFromPersistence2Domain).mock.calls.length).toBe(0);
		expect(mocked(Node_DtoMapper.map2DTO).mock.calls.length).toBe(0);

		//Assertions
	});

	test(' should Not list nodes with sucess  (error case 2)', async () => {
		// should fail becouse sortby is not required
		let l = new Object();

		Object.defineProperty(l, 'filterby', {
			get: jest.fn(() => 'shortName')
		});
		Object.defineProperty(l, 'filtertype', {
			get: jest.fn(() => 'shortName')
		});

		Object.defineProperty(l, 'sortby', {
			get: jest.fn(() => 'InvalidName')
		});

		Node.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(l);
		});

		//Mock the result of Node_Repository.exists to return true
		Node_Repository.prototype.exists = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([ {}, {} ]);
		});

		//Mock the mapper functions

		Node_DtoMapper.map2DTO = jest.fn().mockImplementation((): any => {
			return { name: 'node' };
		});

		Node_DtoMapper.mapFromPersistence2Domain = jest.fn().mockImplementation((): any => {
			return 'result';
		});

		//Run the Service with the mocks
		let serv: ObtainNodeService;

		serv = new ObtainNodeService(new Node_Repository({}));

		let error;
		await serv.listNodesByShortNameOrName(l).catch((err) => {
			error = err;
		});
		expect(error).toBeDefined(); // error is defined becouse of the catch above
		expect(mocked(Node.create).mock.calls.length).toBe(0); // it calls nothing as service trows an error at begining

		expect(mocked(Node_DtoMapper.mapFromPersistence2Domain).mock.calls.length).toBe(0);
		expect(mocked(Node_DtoMapper.map2DTO).mock.calls.length).toBe(0);

		//Assertions
	});

	test(' should Not list nodes with sucess  (error case 3)', async () => {
		// should fail becouse  findWithfilter_AndOr_Sort  returns a rejected promise
		let l = new Object();

		Object.defineProperty(l, 'filterby', {
			get: jest.fn(() => 'shortName')
		});
		Object.defineProperty(l, 'filtertype', {
			get: jest.fn(() => 'shortName')
		});

		Object.defineProperty(l, 'sortby', {
			get: jest.fn(() => 'shortName')
		});

		Node.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(l);
		});

		//Mock the result of Node_Repository.exists to return true
		Node_Repository.prototype.exists = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.reject({ driver: ' error in db' });
		});

		//Mock the mapper functions

		Node_DtoMapper.map2DTO = jest.fn().mockImplementation((): any => {
			return { name: 'node' };
		});

		Node_DtoMapper.mapFromPersistence2Domain = jest.fn().mockImplementation((): any => {
			return 'result';
		});

		//Run the Service with the mocks
		let serv: ObtainNodeService;

		serv = new ObtainNodeService(new Node_Repository({}));

		let error;
		await serv.listNodesByShortNameOrName(l).catch((err) => {
			error = err;
		});
		expect(error).toBeDefined(); // error is defined becouse of the catch above
		expect(mocked(Node.create).mock.calls.length).toBe(0); // it calls nothing as service trows an error at begining

		expect(mocked(Node_DtoMapper.mapFromPersistence2Domain).mock.calls.length).toBe(0);
		expect(mocked(Node_DtoMapper.map2DTO).mock.calls.length).toBe(0);

		//Assertions
	});

	test(' should Not list nodes with sucess  (error case 4)', async () => {
		// should fail becouse  Node.create  returns a rejected promise
		let l = new Object();

		Object.defineProperty(l, 'filterby', {
			get: jest.fn(() => 'shortName')
		});
		Object.defineProperty(l, 'filtertype', {
			get: jest.fn(() => 'shortName')
		});

		Object.defineProperty(l, 'sortby', {
			get: jest.fn(() => 'shortName')
		});

		Node.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.reject(l);
		});

		//Mock the result of Node_Repository.exists to return true
		Node_Repository.prototype.exists = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});
		Node_Repository.prototype.findWithfilter_AndOr_Sort = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.reject({ driver: ' error in db' });
		});

		//Mock the mapper functions

		Node_DtoMapper.map2DTO = jest.fn().mockImplementation((): any => {
			return { name: 'node' };
		});

		Node_DtoMapper.mapFromPersistence2Domain = jest.fn().mockImplementation((): any => {
			return 'result';
		});

		//Run the Service with the mocks
		let serv: ObtainNodeService;

		serv = new ObtainNodeService(new Node_Repository({}));

		let error;
		await serv.listNodesByShortNameOrName(l).catch((err) => {
			error = err;
		});
		expect(error).toBeDefined(); // error is defined becouse of the catch above
		expect(mocked(Node.create).mock.calls.length).toBe(0); // it calls nothing as service trows an error at begining

		expect(mocked(Node_DtoMapper.mapFromPersistence2Domain).mock.calls.length).toBe(0);
		expect(mocked(Node_DtoMapper.map2DTO).mock.calls.length).toBe(0);

		//Assertions
	});
});
