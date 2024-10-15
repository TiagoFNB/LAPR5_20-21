import { mocked } from 'ts-jest/utils';

const Base_Repository = require('../../../../Repositories/MongoDB_Repositories/Base_Repository/Base_Repository');
import { Node_Repository } from '../../../../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository';
import { Node } from '../../../../Node/domain/Node';
//Mock drivertype_repo object
jest.createMockFromModule('../../../../Repositories/MongoDB_Repositories/Base_Repository/Base_Repository');
jest.createMockFromModule('../../../../Node/domain/Node');
beforeEach(() => {
	// Clears the record of calls to the mock constructor functions and its methods
	mocked(Node.obtainIdField).mockClear;
	mocked(Base_Repository).mockClear;
});

describe('Filter function', () => {
	test('create should work', async () => {
		Base_Repository.prototype.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve('true');
		});

		//Run the Service with the mocks
		let serv: Node_Repository;

		serv = new Node_Repository(undefined);
		let res;
		const result = await serv.create(undefined);
		//Assertions

		expect(mocked(Base_Repository.prototype.create).mock.calls.length).toBe(1);

		expect(result).toBe('true');
	});

	test('create should fail ', async () => {
		Base_Repository.prototype.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.reject('failure');
		});

		//Run the Service with the mocks
		let serv: Node_Repository;

		serv = new Node_Repository(undefined);
		let res;
		await serv.create(undefined).catch((result) => {
			res = result;
		});
		//Assertions

		expect(mocked(Base_Repository.prototype.create).mock.calls.length).toBe(1);

		expect(res).toBe('failure');
	});

	test('findListObjects should work ', async () => {
		Base_Repository.prototype.findListObjects = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve('success');
		});

		//Run the Service with the mocks
		let serv: Node_Repository;

		serv = new Node_Repository(undefined);
		let res;
		const result = await serv.findListObjects(undefined, undefined);
		//Assertions

		expect(mocked(Base_Repository.prototype.findListObjects).mock.calls.length).toBe(1);

		expect(result).toBe('success');
	});

	test('findListObjects should fail ', async () => {
		Base_Repository.prototype.findListObjects = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.reject('failure');
		});

		//Run the Service with the mocks
		let serv: Node_Repository;

		serv = new Node_Repository(undefined);
		let res;
		await serv.findListObjects(undefined, undefined).catch((result) => {
			res = result;
		});
		//Assertions

		expect(mocked(Base_Repository.prototype.findListObjects).mock.calls.length).toBe(1);

		expect(res).toBe('failure');
	});
});
