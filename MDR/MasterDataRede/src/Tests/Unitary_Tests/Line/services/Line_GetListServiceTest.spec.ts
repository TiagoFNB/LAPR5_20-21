import { mocked } from 'ts-jest/utils';
import { Line_Repository } from '../../../../Repositories/MongoDB_Repositories/Line_Repository/Line_Repository';
import { Line_DtoMapper } from '../../../../Line/mappers/Line_DtoMapper';
import {Line_GetListService} from '../../../../Line/services/Line_GetListService';
import {IDTO_List_Lines} from '../../../../Line/interfaces/IDTO_List_Lines';

//Mock line_repo object
jest.createMockFromModule('../../../../Repositories/MongoDB_Repositories/Line_Repository/Line_Repository');

//Mock mapper object
jest.createMockFromModule('../../../../Line/mappers/Line_DtoMapper');

//Clear all mock implementations before each test
beforeEach(() => {
	// Clears the record of calls to the mock constructor functions and its methods
	mocked(Line_Repository).mockClear;
	mocked(Line_DtoMapper).mockClear;
});

describe('List lines test', () => {
	test('should list lines with sucess  (success case 1)', async () => {
		let l = new Object();

		Object.defineProperty(l, 'filter', {
			get: jest.fn(() => 'name')
		});
		Object.defineProperty(l, 'typeFilter', {
			get: jest.fn(() => 'name')
		});

		Object.defineProperty(l, 'sortBy', {
			get: jest.fn(() => 'name')
		});

		Line_Repository.prototype.findListOfLines = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([ {}, {} ]);
		});

		//Mock the mapper functions

		Line_DtoMapper.map2Dto_List_Lines = jest.fn().mockImplementation((): any => {
			return [{ name: 'lineTest' },{ name: 'lineTest' }];
		});


		//Run the Service with the mocks
		let serv: Line_GetListService;
		serv = new Line_GetListService(new Line_Repository({}));
		const result = await serv.getList(l as IDTO_List_Lines);

		//Assertions
		expect(mocked(Line_Repository.prototype.findListOfLines).mock.calls.length).toBe(1);
		expect(mocked(Line_DtoMapper.map2Dto_List_Lines).mock.calls.length).toBe(1);

		expect(result[0]).toStrictEqual({ name: 'lineTest' });
		expect(result[1]).toStrictEqual({ name: 'lineTest' });
	});

	test(' should Not list lines with sucess, typefilter wrong  (error case 1)', async () => {
		// should fail becouse filterby is not required
		let l = new Object();

		Object.defineProperty(l, 'filter', {
			get: jest.fn(() => 'P')
		});
		Object.defineProperty(l, 'typeFilter', {
			get: jest.fn(() => 'InvalidName')
		});

		Object.defineProperty(l, 'sortBy', {
			get: jest.fn(() => 'name')
		});

	
	Line_Repository.prototype.findListOfLines = jest.fn().mockImplementation((): Promise<any> => {
		return Promise.resolve([{}]);
	});

	//Mock the mapper functions

	Line_DtoMapper.map2Dto_List_Lines = jest.fn().mockImplementation((): any => {
		return { name: 'lineTest' };
	});


		//Run the Service with the mocks
		let serv: Line_GetListService;

		serv = new Line_GetListService(new Line_Repository({}));

		let error;
		await serv.getList(l as IDTO_List_Lines).catch((err) => {
			error = err;
		});
		expect(error).toBeDefined(); // error is defined becouse of the catch above
		expect(mocked(Line_DtoMapper.map2Dto_List_Lines).mock.calls.length).toBe(0);


		//Assertions
		expect(error.message).toBe("typeFilter must be 'name' or 'key'");
	});

	test(' should Not list lines with sucess, sortBy wrong  (error case 2)', async () => {
		// should fail becouse filterby is not required
		let l = new Object();

		Object.defineProperty(l, 'filter', {
			get: jest.fn(() => 'P')
		});
		Object.defineProperty(l, 'typeFilter', {
			get: jest.fn(() => 'name')
		});

		Object.defineProperty(l, 'sortBy', {
			get: jest.fn(() => 'WrongName')
		});

	
	Line_Repository.prototype.findListOfLines = jest.fn().mockImplementation((): Promise<any> => {
		return Promise.resolve([ {}, {} ]);
	});

	//Mock the mapper functions

	Line_DtoMapper.map2Dto_List_Lines = jest.fn().mockImplementation((): any => {
		return { name: 'lineTest' };
	});


		//Run the Service with the mocks
		let serv: Line_GetListService;

		serv = new Line_GetListService(new Line_Repository({}));

		let error;
		await serv.getList(l as IDTO_List_Lines).catch((err) => {
			error = err;
		});
		expect(error).toBeDefined(); // error is defined becouse of the catch above
		expect(mocked(Line_DtoMapper.map2Dto_List_Lines).mock.calls.length).toBe(0);


		//Assertions
		expect(error.message).toBe("sortBy type must be 'name' or 'key'");
	});

	test(' should Not list lines with sucess,  typefilter undefined yet filter is present (error case 3)', async () => {
		// should fail becouse filterby is not required
		let l = new Object();

		Object.defineProperty(l, 'filter', {
			get: jest.fn(() => undefined)
		});
		Object.defineProperty(l, 'typeFilter', {
			get: jest.fn(() => 'name')
		});

		Object.defineProperty(l, 'sortBy', {
			get: jest.fn(() => 'name')
		});

	
	Line_Repository.prototype.findListOfLines = jest.fn().mockImplementation((): Promise<any> => {
		return Promise.resolve([ {}, {} ]);
	});

	//Mock the mapper functions

	Line_DtoMapper.map2Dto_List_Lines = jest.fn().mockImplementation((): any => {
		return { name: 'lineTest' };
	});


		//Run the Service with the mocks
		let serv: Line_GetListService;

		serv = new Line_GetListService(new Line_Repository({}));

		let error;
		await serv.getList(l as IDTO_List_Lines).catch((err) => {
			error = err;
		});
		expect(error).toBeDefined(); // error is defined becouse of the catch above
		expect(mocked(Line_DtoMapper.map2Dto_List_Lines).mock.calls.length).toBe(0);


		//Assertions
		expect(error.message).toBe("filter is missing");
	});

	test(' should Not list lines with sucess, no typefilter or sort  (error case 4)', async () => {
		// should fail becouse filterby is not required
		let l = new Object();

		Object.defineProperty(l, 'filter', {
			get: jest.fn(() => undefined)
		});
		Object.defineProperty(l, 'typeFilter', {
			get: jest.fn(() => undefined)
		});

		Object.defineProperty(l, 'sortBy', {
			get: jest.fn(() => undefined)
		});

	
	Line_Repository.prototype.findListOfLines = jest.fn().mockImplementation((): Promise<any> => {
		return Promise.resolve([ {}, {} ]);
	});

	//Mock the mapper functions

	Line_DtoMapper.map2Dto_List_Lines = jest.fn().mockImplementation((): any => {
		return { name: 'lineTest' };
	});


		//Run the Service with the mocks
		let serv: Line_GetListService;

		serv = new Line_GetListService(new Line_Repository({}));

		let error;
		await serv.getList(l as IDTO_List_Lines).catch((err) => {
			error = err;
		});
		expect(error).toBeDefined(); // error is defined becouse of the catch above
		expect(mocked(Line_DtoMapper.map2Dto_List_Lines).mock.calls.length).toBe(0);


		//Assertions
		expect(error.message).toBe("Sort or filter is needed");
	});

	test(' should Not list lines with sucess, typefilter undefined yet it has filter (error case 5)', async () => {
		// should fail becouse filterby is not required
		let l = new Object();

		Object.defineProperty(l, 'filter', {
			get: jest.fn(() => 'P')
		});
		Object.defineProperty(l, 'typeFilter', {
			get: jest.fn(() => undefined)
		});

		Object.defineProperty(l, 'sortBy', {
			get: jest.fn(() => 'name')
		});

	
	Line_Repository.prototype.findListOfLines = jest.fn().mockImplementation((): Promise<any> => {
		return Promise.resolve([ {}, {} ]);
	});

	//Mock the mapper functions

	Line_DtoMapper.map2Dto_List_Lines = jest.fn().mockImplementation((): any => {
		return { name: 'lineTest' };
	});


		//Run the Service with the mocks
		let serv: Line_GetListService;

		serv = new Line_GetListService(new Line_Repository({}));

		let error;
		await serv.getList(l as IDTO_List_Lines).catch((err) => {
			error = err;
		});
		expect(error).toBeDefined(); // error is defined becouse of the catch above
		expect(mocked(Line_DtoMapper.map2Dto_List_Lines).mock.calls.length).toBe(0);


		//Assertions
		expect(error.message).toBe("Must define typeFilter to 'name' or 'key'");
	});

});
