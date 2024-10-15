import { mocked } from 'ts-jest/utils';

import { VehicleType_Repository } from '../../../../Repositories/MongoDB_Repositories/VehicleType_Repository/VehicleType_Repository';
import { VehicleType } from '../../../../VehicleType/domain/VehicleType';
import { VehicleType_Mapper } from '../../../../VehicleType/mappers/VehicleTypeMap';
import RegisterVehicleTypeService from '../../../../VehicleType/services/RegisterVehicleTypeService';

//Mock line object
jest.createMockFromModule('../../../../VehicleType/domain/VehicleType');

//Mock vehicletype_repo object
jest.createMockFromModule(
	'../../../../Repositories/MongoDB_Repositories/VehicleType_Repository/VehicleType_Repository'
);

//Mock mapper object
jest.createMockFromModule('../../../../VehicleType/mappers/VehicleTypeMap');

//Clear all mock implementations before each test
beforeEach(() => {
	// Clears the record of calls to the mock constructor functions and its methods
	mocked(VehicleType.create).mockClear;
	mocked(VehicleType_Repository).mockClear;
	mocked(VehicleType_Mapper).mockClear;
});

describe('Create vehicle type service test', () => {
	// test('RegisterVehicleTypeService should create a new vehicle type with sucess (success case 1)', async () => {
	// 	let l = new Object();

	// 	VehicleType.create = jest.fn().mockImplementation((): Promise<any> => {
	// 		return Promise.resolve(l);
	// 	});

	// 	VehicleType_Repository.prototype.create = jest.fn().mockImplementation((): Promise<any> => {
	// 		return Promise.resolve(true);
	// 	});

	// 	//Mock the mapper functions

	// 	VehicleType_Mapper.mapDTO2Domain = jest.fn().mockImplementation((): any => {
	// 		return undefined;
	// 	});
	// 	VehicleType_Mapper.mapDomain2Persistence = jest.fn().mockImplementation((): any => {
	// 		return undefined;
	// 	});
	// 	VehicleType_Mapper.map2DTO = jest.fn().mockImplementation((): any => {
	// 		return 'result';
	// 	});

	// 	//Run the Service with the mocks
	// 	let serv: RegisterVehicleTypeService;

	// 	serv = new RegisterVehicleTypeService(new VehicleType_Repository({}));
	// 	const result = await serv.registerVehicleType(l);

	// 	//Assertions
	// 	expect(mocked(VehicleType.create).mock.calls.length).toBe(1);
	// 	expect(mocked(VehicleType_Repository.prototype.create).mock.calls.length).toBe(1);
	// 	expect(mocked(VehicleType_Mapper.mapDTO2Domain).mock.calls.length).toBe(1);
	// 	expect(mocked(VehicleType_Mapper.mapDomain2Persistence).mock.calls.length).toBe(1);
	// 	expect(mocked(VehicleType_Mapper.map2DTO).mock.calls.length).toBe(1);

	// 	expect(result).toBe('result');
	// });

	test(' RegisterVehicleTypeService should Not create a new vehicle type with sucess (error case 1)', async () => {
		let l = new Object();

		VehicleType.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.reject('error');
		});

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});

		//Mock the mapper functions

		VehicleType_Mapper.mapDTO2Domain = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		VehicleType_Mapper.mapDomain2Persistence = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		VehicleType_Mapper.map2DTO = jest.fn().mockImplementation((): any => {
			return 'result';
		});

		//Run the Service with the mocks
		let serv: RegisterVehicleTypeService;

		serv = new RegisterVehicleTypeService(new VehicleType_Repository({}));
		let error;
		await serv.registerVehicleType(l).catch((err) => {
			error = err;
		});

		//Assertions
		expect(mocked(VehicleType.create).mock.calls.length).toBe(1);
		expect(mocked(VehicleType_Repository.prototype.create).mock.calls.length).toBe(0);
		expect(mocked(VehicleType_Mapper.mapDTO2Domain).mock.calls.length).toBe(1);
		expect(mocked(VehicleType_Mapper.mapDomain2Persistence).mock.calls.length).toBe(0);
		expect(mocked(VehicleType_Mapper.map2DTO).mock.calls.length).toBe(0);

		expect(error).toBe('error');
	});

	test(' RegisterVehicleTypeService should Not create a new vehicle type with sucess (error case 2)', async () => {
		let l = new Object();

		VehicleType.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve(true);
		});

		VehicleType_Repository.prototype.create = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.reject('error');
		});

		//Mock the mapper functions

		VehicleType_Mapper.mapDTO2Domain = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		VehicleType_Mapper.mapDomain2Persistence = jest.fn().mockImplementation((): any => {
			return undefined;
		});
		VehicleType_Mapper.map2DTO = jest.fn().mockImplementation((): any => {
			return 'result';
		});

		//Run the Service with the mocks
		let serv: RegisterVehicleTypeService;

		serv = new RegisterVehicleTypeService(new VehicleType_Repository({}));
		let error;
		await serv.registerVehicleType(l).catch((err) => {
			error = err;
		});

		//Assertions
		expect(mocked(VehicleType.create).mock.calls.length).toBe(1);
		expect(mocked(VehicleType_Repository.prototype.create).mock.calls.length).toBe(1);
		expect(mocked(VehicleType_Mapper.mapDTO2Domain).mock.calls.length).toBe(1);
		expect(mocked(VehicleType_Mapper.mapDomain2Persistence).mock.calls.length).toBe(1);
		expect(mocked(VehicleType_Mapper.map2DTO).mock.calls.length).toBe(0);

		expect(error).toBe('error');
	});
});
