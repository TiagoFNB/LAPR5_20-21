import { mocked } from 'ts-jest/utils';

import { Node_Repository } from '../../../../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository';
import { Node } from '../../../../Node/domain/Node';
import { Node_DtoMapper } from '../../../../Node/mappers/Node_DtoMapper';
import RegisterNodeService from '../../../../Node/services/RegisterNodeService';

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

describe('Create node test', () => {
	test('registerNode should create a new node with sucess (success case 1)', async () => {
		let l = new Object();

		Object.defineProperty(l, 'crewTravelTimeReferenceNode', {
			get: jest.fn(() => 'referenceNode')
		});

		Object.defineProperty(l, 'shortName', {
			get: jest.fn(() => 'shortName')
		});

		Node.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(l);
		});

		//Mock the result of Node_Repository.exists to return true
		Node_Repository.prototype.exists = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});
		Node_Repository.prototype.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});

		//Mock the mapper functions

		Node_DtoMapper.mapDTO2Domain = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		Node_DtoMapper.mapDomain2Persistence = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		Node_DtoMapper.map2DTO = jest.fn().mockImplementation((): any => {
			return 'result';
		});

		//Run the Service with the mocks
		let serv: RegisterNodeService;

		serv = new RegisterNodeService(new Node_Repository({}));
		const result = await serv.registerNode(l);

		//Assertions
		expect(mocked(Node.create).mock.calls.length).toBe(1);
		expect(mocked(Node_Repository.prototype.create).mock.calls.length).toBe(1);
		expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(1);

		expect(mocked(Node_DtoMapper.mapDTO2Domain).mock.calls.length).toBe(1);
		expect(mocked(Node_DtoMapper.mapDomain2Persistence).mock.calls.length).toBe(1);
		expect(mocked(Node_DtoMapper.map2DTO).mock.calls.length).toBe(1);

		expect(result).toBe('result');
	});

	test('registerNode should create a new node with sucess (success case 2)', async () => {
		let l = new Object();
		//crewTravelTimeReferenceNode is equal to shortName
		Object.defineProperty(l, 'crewTravelTimeReferenceNode', {
			get: jest.fn(() => 'referenceNode')
		});

		Object.defineProperty(l, 'shortName', {
			get: jest.fn(() => 'referenceNode')
		});

		Node.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(l);
		});

		//Mock the result of Node_Repository.exists to return true
		Node_Repository.prototype.exists = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});
		Node_Repository.prototype.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});

		//Mock the mapper functions

		Node_DtoMapper.mapDTO2Domain = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		Node_DtoMapper.mapDomain2Persistence = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		Node_DtoMapper.map2DTO = jest.fn().mockImplementation((): any => {
			return 'result';
		});

		//Run the Service with the mocks
		let serv: RegisterNodeService;

		serv = new RegisterNodeService(new Node_Repository({}));
		const result = await serv.registerNode(l);

		//Assertions
		expect(mocked(Node.create).mock.calls.length).toBe(1);
		expect(mocked(Node_Repository.prototype.create).mock.calls.length).toBe(1);
		expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(0); // it will not call exist in this case

		expect(mocked(Node_DtoMapper.mapDTO2Domain).mock.calls.length).toBe(1);
		expect(mocked(Node_DtoMapper.mapDomain2Persistence).mock.calls.length).toBe(1);
		expect(mocked(Node_DtoMapper.map2DTO).mock.calls.length).toBe(1);

		expect(result).toBe('result');
	});

	test('registerNode should create a new node with sucess (success case 3)', async () => {
		let l = new Object();

		//when crewTravelTimeReferenceNode is not defined i assume that the crewTravelTimeReferenceNode is that node itself
		Object.defineProperty(l, 'crewTravelTimeReferenceNode', {
			get: jest.fn(() => undefined)
		});

		Object.defineProperty(l, 'shortName', {
			get: jest.fn(() => 'shortName')
		});

		Node.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(l);
		});

		//Mock the result of Node_Repository.exists to return true
		Node_Repository.prototype.exists = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});
		Node_Repository.prototype.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});

		//Mock the mapper functions

		Node_DtoMapper.mapDTO2Domain = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		Node_DtoMapper.mapDomain2Persistence = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		Node_DtoMapper.map2DTO = jest.fn().mockImplementation((): any => {
			return 'result';
		});

		//Run the Service with the mocks
		let serv: RegisterNodeService;

		serv = new RegisterNodeService(new Node_Repository({}));
		const result = await serv.registerNode(l);

		//Assertions
		expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(0); // exist wont be called here
		expect(mocked(Node_DtoMapper.mapDTO2Domain).mock.calls.length).toBe(1);
		expect(mocked(Node.create).mock.calls.length).toBe(1);
		expect(mocked(Node_DtoMapper.mapDomain2Persistence).mock.calls.length).toBe(1);
		expect(mocked(Node_Repository.prototype.create).mock.calls.length).toBe(1);
		expect(mocked(Node_DtoMapper.map2DTO).mock.calls.length).toBe(1);

		expect(result).toBe('result');
	});

	test('registerNode should NOT create a new node with sucess (invalid case 4)', async () => {
		let l = new Object();
		//crewTravelTimeReferenceNode is equal to shortName
		Object.defineProperty(l, 'crewTravelTimeReferenceNode', {
			get: jest.fn(() => 'referenceNode')
		});

		Object.defineProperty(l, 'shortName', {
			get: jest.fn(() => 'referenceNode')
		});

		Node.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.reject('error');
		});

		//Mock the result of Node_Repository.exists to return true
		Node_Repository.prototype.exists = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});
		Node_Repository.prototype.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});

		//Mock the mapper functions

		Node_DtoMapper.mapDTO2Domain = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		Node_DtoMapper.mapDomain2Persistence = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		Node_DtoMapper.map2DTO = jest.fn().mockImplementation((): any => {
			return 'result';
		});

		//Run the Service with the mocks
		let serv: RegisterNodeService;

		serv = new RegisterNodeService(new Node_Repository({}));
		let err;
		await serv.registerNode(l).catch((error) => {
			err = error;
		});

		//Assertions

		expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(0); // it will not call exist in this case

		expect(mocked(Node_DtoMapper.mapDTO2Domain).mock.calls.length).toBe(1);
		expect(mocked(Node.create).mock.calls.length).toBe(1);
		expect(mocked(Node_DtoMapper.mapDomain2Persistence).mock.calls.length).toBe(0);
		expect(mocked(Node_Repository.prototype.create).mock.calls.length).toBe(0);
		expect(mocked(Node_DtoMapper.map2DTO).mock.calls.length).toBe(0);

		expect(err).toBe('error');
	});

	test('registerNode should NOT create a new node with sucess (invalid case 5)', async () => {
		let l = new Object();
		//crewTravelTimeReferenceNode  not equal  to shortName
		Object.defineProperty(l, 'crewTravelTimeReferenceNode', {
			get: jest.fn(() => 'crewTravelTimeReferenceNode')
		});

		Object.defineProperty(l, 'shortName', {
			get: jest.fn(() => 'referenceNode')
		});

		Node.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.reject('error');
		});

		//Mock the result of Node_Repository.exists to return true
		Node_Repository.prototype.exists = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});
		Node_Repository.prototype.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});

		//Mock the mapper functions

		Node_DtoMapper.mapDTO2Domain = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		Node_DtoMapper.mapDomain2Persistence = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		Node_DtoMapper.map2DTO = jest.fn().mockImplementation((): any => {
			return 'result';
		});

		//Run the Service with the mocks
		let serv: RegisterNodeService;

		serv = new RegisterNodeService(new Node_Repository({}));
		let err;
		await serv.registerNode(l).catch((error) => {
			err = error;
		});

		//Assertions

		expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(1); // it will  call exist in this case

		expect(mocked(Node_DtoMapper.mapDTO2Domain).mock.calls.length).toBe(1);
		expect(mocked(Node.create).mock.calls.length).toBe(1);
		expect(mocked(Node_DtoMapper.mapDomain2Persistence).mock.calls.length).toBe(0);
		expect(mocked(Node_Repository.prototype.create).mock.calls.length).toBe(0);
		expect(mocked(Node_DtoMapper.map2DTO).mock.calls.length).toBe(0);

		expect(err).toBe('error');
	});

	test('registerNode should NOT create a new node with sucess (invalid case 6)', async () => {
		let l = new Object();
		//crewTravelTimeReferenceNode  not equal  to shortName
		Object.defineProperty(l, 'crewTravelTimeReferenceNode', {
			get: jest.fn(() => 'crewTravelTimeReferenceNode')
		});

		Object.defineProperty(l, 'shortName', {
			get: jest.fn(() => 'referenceNode')
		});

		Node.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(l);
		});

		//Mock the result of Node_Repository.exists to return true

		// it will fail becouse the crewTravelTimeReferenceNode dosent exist
		Node_Repository.prototype.exists = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.reject('error');
		});
		Node_Repository.prototype.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});

		//Mock the mapper functions

		Node_DtoMapper.mapDTO2Domain = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		Node_DtoMapper.mapDomain2Persistence = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		Node_DtoMapper.map2DTO = jest.fn().mockImplementation((): any => {
			return 'result';
		});

		//Run the Service with the mocks
		let serv: RegisterNodeService;

		serv = new RegisterNodeService(new Node_Repository({}));
		let err;
		await serv.registerNode(l).catch((error) => {
			err = error;
		});

		//Assertions

		expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(1); // it will  call exist in this case and fail here

		expect(mocked(Node_DtoMapper.mapDTO2Domain).mock.calls.length).toBe(0);
		expect(mocked(Node.create).mock.calls.length).toBe(0);
		expect(mocked(Node_DtoMapper.mapDomain2Persistence).mock.calls.length).toBe(0);
		expect(mocked(Node_Repository.prototype.create).mock.calls.length).toBe(0);
		expect(mocked(Node_DtoMapper.map2DTO).mock.calls.length).toBe(0);

		expect(err).toBe('error');
	});

	test('registerNode should NOT create a new node with sucess (invalid case 7)', async () => {
		let l = new Object();
		//crewTravelTimeReferenceNode  not equal  to shortName
		Object.defineProperty(l, 'crewTravelTimeReferenceNode', {
			get: jest.fn(() => 'crewTravelTimeReferenceNode')
		});

		Object.defineProperty(l, 'shortName', {
			get: jest.fn(() => 'referenceNode')
		});

		Node.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(l);
		});

		//Mock the result of Node_Repository.exists to return true

		Node_Repository.prototype.exists = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});

		// it will fail becouse the probably the node already exists in database
		Node_Repository.prototype.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.reject('error');
		});

		//Mock the mapper functions

		Node_DtoMapper.mapDTO2Domain = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		Node_DtoMapper.mapDomain2Persistence = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		Node_DtoMapper.map2DTO = jest.fn().mockImplementation((): any => {
			return 'result';
		});

		//Run the Service with the mocks
		let serv: RegisterNodeService;

		serv = new RegisterNodeService(new Node_Repository({}));
		let err;
		await serv.registerNode(l).catch((error) => {
			err = error;
		});

		//Assertions

		expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(1); // it will  call exist in this case and fail here

		expect(mocked(Node_DtoMapper.mapDTO2Domain).mock.calls.length).toBe(1);
		expect(mocked(Node.create).mock.calls.length).toBe(1);
		expect(mocked(Node_DtoMapper.mapDomain2Persistence).mock.calls.length).toBe(1);
		expect(mocked(Node_Repository.prototype.create).mock.calls.length).toBe(1);
		expect(mocked(Node_DtoMapper.map2DTO).mock.calls.length).toBe(0);

		expect(err).toBe('error');
	});
});
