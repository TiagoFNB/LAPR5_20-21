import { mocked } from 'ts-jest/utils';
import { Line_GetPathsController } from '../../../Line/controller/Line_GetPathsController';
import { Line_GetPathsService } from '../../../Line/services/Line_GetPathsService';
import {Line_Repository} from '../../../Repositories/MongoDB_Repositories/Line_Repository/Line_Repository';
import {Path_Repository} from '../../../Repositories/MongoDB_Repositories/Path_Repository/Path_Repository';

//Mock line_repo object
jest.createMockFromModule('../../../Repositories/MongoDB_Repositories/Line_Repository/Line_Repository');

//Mock path_repo object
jest.createMockFromModule('../../../Repositories/MongoDB_Repositories/Path_Repository/Path_Repository');

//Clear all mock implementations before each test
beforeEach(() => {
    // Clears the record of calls to the mock constructor functions and its methods
    mocked(Line_Repository).mockClear;
    mocked(Path_Repository).mockClear;
});

describe('Integration Tests: Get Paths from Line -> Integration includes controller-service-domain', () => {
    test('Paths should be obtained -> (success case 1) : List is received', async () => {

        //Request starts with this valid body
        let req = new Object();

        Object.defineProperty(req,"params", {
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'key',{
                    get : jest.fn(()=>"line1")
                });
                return o;})
        });

        //Defining the expected return from findListObjects
        let paths = [{
            key:"path0",
            type:"type0",
            pathSegments: [],
            isEmpty:"yes"
        },
        {
            key:"path1",
            type:"type1",
            pathSegments: [],
            isEmpty:"yes"
        }];

        //Mock the result of LineRepository.exists 
        Line_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });

        //Mock the result of Path_Repository.findListObjects
        Path_Repository.prototype.findPathsOfLine = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(paths);
        });


        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Line_GetPathsController;

         serv = new Line_GetPathsController(new Line_GetPathsService(new Line_Repository(undefined), new Path_Repository(undefined)));
         await serv.getPaths(req,res);
         
        //Assertions
        expect(mocked(Line_Repository.prototype.exists).mock.calls.length).toBe(1);
        expect(mocked(Path_Repository.prototype.findPathsOfLine).mock.calls.length).toBe(1);



        expect(res._getData().key).toBe("line1");
        expect(res._getData().paths).toStrictEqual(paths);

        expect(res.statusCode).toBe(200);
    });

    test('Paths should be obtained -> (success case 2) : Empty list is received ', async () => {

        //Request starts with this valid body
        let req = new Object();

        Object.defineProperty(req,"params", {
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'key',{
                    get : jest.fn(()=>"line1")
                });
                return o;})
        });

        //Defining the expected return from findListObjects
        let paths = [];

        //Mock the result of LineRepository.exists 
        Line_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });

        //Mock the result of Path_Repository.findListObjects
        Path_Repository.prototype.findPathsOfLine = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(paths);
        });


        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Line_GetPathsController;

         serv = new Line_GetPathsController(new Line_GetPathsService(new Line_Repository(undefined), new Path_Repository(undefined)));
         await serv.getPaths(req,res);
         
        //Assertions
        expect(mocked(Line_Repository.prototype.exists).mock.calls.length).toBe(1);
        expect(mocked(Path_Repository.prototype.findPathsOfLine).mock.calls.length).toBe(1);



        expect(res._getData().key).toBe("line1");
        expect(res._getData().paths).toStrictEqual([]);

        expect(res.statusCode).toBe(200);
    });

    test('Paths should not be obtained -> (failure case 1) : Line does not exist', async () => {

        //Request starts with this valid body
        let req = new Object();

        Object.defineProperty(req,"params", {
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'key',{
                    get : jest.fn(()=>"line1")
                });
                return o;})
        });

        //Defining the expected return from findListObjects
        let paths = [];

        //Mock the result of LineRepository.exists 
        Line_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(false);
        });

        //Mock the result of Path_Repository.findListObjects
        Path_Repository.prototype.findPathsOfLine = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(paths);
        });


        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Line_GetPathsController;

         serv = new Line_GetPathsController(new Line_GetPathsService(new Line_Repository(undefined), new Path_Repository(undefined)));
         await serv.getPaths(req,res);
         
        //Assertions
        expect(mocked(Line_Repository.prototype.exists).mock.calls.length).toBe(1);
        expect(mocked(Path_Repository.prototype.findPathsOfLine).mock.calls.length).toBe(0);

        expect(res._getData()).toBe("Line with id: line1 does not exist.");

        expect(res.statusCode).toBe(400);
    });

    test('Paths should not be obtained -> (failure case 2) : db fails to obtain list of paths from line', async () => {

        //Request starts with this valid body
        let req = new Object();

        Object.defineProperty(req,"params", {
            get : jest.fn(() => {
                let o = new Object();
                Object.defineProperty(o,'key',{
                    get : jest.fn(()=>"line1")
                });
                return o;})
        });

        //Mock the result of LineRepository.exists 
        Line_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });

        //Mock the result of Path_Repository.findListObjects
        Path_Repository.prototype.findPathsOfLine = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject({message: "error"});
        });


        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Line_GetPathsController;

         serv = new Line_GetPathsController(new Line_GetPathsService(new Line_Repository(undefined), new Path_Repository(undefined)));
         await serv.getPaths(req,res);
         
        //Assertions
        expect(mocked(Line_Repository.prototype.exists).mock.calls.length).toBe(1);
        expect(mocked(Path_Repository.prototype.findPathsOfLine).mock.calls.length).toBe(1);

        expect(res._getData()).toBe("error");

        expect(res.statusCode).toBe(400);
    });
});