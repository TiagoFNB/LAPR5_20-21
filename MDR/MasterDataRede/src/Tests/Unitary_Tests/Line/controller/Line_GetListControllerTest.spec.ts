import { mocked } from 'ts-jest/utils';
import {Line_GetListService} from '../../../../Line/services/Line_GetListService';
import {Line_GetListController} from '../../../../Line/controller/Line_GetListController';
const url = require('url');
describe('Filter function', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor functions and its methods
		mocked(url.parse).mockClear;
	});

	test('controller should get List of Lines (success case 1)', async () => {
		//Define a req object simulation
		let req = new Object();

		Object.defineProperty(req, 'body', {
			value: ''
		});
		// mocking url module parse function
		url.parse = jest.fn().mockImplementation((): any => {
			return 'string';
		});

		//Create a res object
		let res = require('node-mocks-http').createResponse();

		//Mock the result of Line_CreateService.registerLine
        Line_GetListService.prototype.getList = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.resolve([ { name: 'test1' }, { name: 'test12' } ]);
		});

		//Run the Controller with the mocks
        let contr = new Line_GetListController(new Line_GetListService(undefined));
		await contr.getList(req, res);

		//Assertions
        expect(mocked(Line_GetListService.prototype.getList).mock.calls.length).toBe(1);
		expect(res._getData()).toBeDefined();
		expect(res._getData()[0].name).toBe('test1');
		expect(res._getData()[1].name).toBe('test12');
		expect(res.statusCode).toBe(200);
	});

	test('controller should Not return list of lines (error case 1)', async () => {
		//Define a req object simulation
		let req = new Object();

		Object.defineProperty(req, 'body', {
			value: ''
		});
		// mocking url module parse function
		url.parse = jest.fn().mockImplementation((): any => {
			return 'string';
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
				value: { Error: 'error test 1' }
			}
		});

		//Mock the result of Line_CreateService.registerLine
        Line_GetListService.prototype.getList = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.reject(err);
		});

		//Run the Controller with the mocks
        let contr = new Line_GetListController(new Line_GetListService(undefined));

		await contr.getList(req, res);

		//Assertions
        expect(mocked(Line_GetListService.prototype.getList).mock.calls.length).toBe(1);
		expect(res._getData().Error).toBe('error test 1');
		expect(res.statusCode).toBe(422); // status code 422 becouse the error returned by the service has a driver field, in real scenario it means it came from the DB, always becouse of duplicated identity or other restriction
	});

	test('controller should Not return list of lines (error case 3)', async () => {
		//Define a req object simulation
		let req = new Object();

		Object.defineProperty(req, 'body', {
			value: ''
		});
		// mocking url module parse function
		url.parse = jest.fn().mockImplementation((): any => {
			return 'string';
		});

		//Create a res object
		let res = require('node-mocks-http').createResponse();

		//defining the err object, this is the object that the service will return to the controller
		let err = new Object();

		Object.defineProperties(err, {
			message: {
				value: { Error: 'error test 2' }
			}
		});

		//Mock the result of Line_CreateService.registerLine
        Line_GetListService.prototype.getList = jest.fn().mockImplementation((): Promise<any> => {
			return Promise.reject(err);
		});

		//Run the Controller with the mocks
        let contr = new Line_GetListController(new Line_GetListService
        (undefined));

		await contr.getList(req, res);

		//Assertions
        expect(mocked(Line_GetListService.prototype.getList).mock.calls.length).toBe(1);
		expect(res._getData().Error).toBe('error test 2');
		expect(res.statusCode).toBe(400); // status code 400 becouse the error is not from DB and probably froma  local validation
	});
});
