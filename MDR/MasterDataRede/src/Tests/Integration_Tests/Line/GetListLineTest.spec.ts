import { mocked } from 'ts-jest/utils';
import {Line_GetListController} from '../../../Line/controller/Line_GetListController';
import {Line_GetListService} from '../../../Line/services/Line_GetListService';
import {Line_Repository} from '../../../Repositories/MongoDB_Repositories/Line_Repository/Line_Repository';
import {Request} from 'express';
//Mock line_repo object
jest.createMockFromModule('../../../Repositories/MongoDB_Repositories/Line_Repository/Line_Repository');

//Clear all mock implementations before each test
beforeEach(() => {
    // Clears the record of calls to the mock constructor functions and its methods
    mocked(Line_Repository).mockClear;
});

describe('Integration Tests: Get List of Lines from Line Repository -> Integration includes controller-service-domain', () => {
    test('List of lines should be obtained -> (success case 1) : List is received', async () => {

        //Request starts with this valid body
        let req = {
            url : '/listByQuery?typeFilter=name&filter=P&sortBy=name'
        } as Request;

        //Defining the expected return from findListOfLines
        let lines = [{
            key:"line0",
            name:"line0",
            terminalNode1: "nodeTest1",
            terminalNode2: "nodeTest2",
            AllowedDrivers: undefined,
            AllowedVehicles: undefined
        },
        {
            key:"line1",
            name:"line1",
            terminalNode1: "nodeTest1",
            terminalNode2: "nodeTest2",
            AllowedDrivers: undefined,
            AllowedVehicles: undefined
        }];

        //Mock the result of LineRepository.exists 
        Line_Repository.prototype.findListOfLines = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(lines);
        });



        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Line_GetListController;

         serv = new Line_GetListController(new Line_GetListService(new Line_Repository(undefined)));
         await serv.getList(req,res);
         
        //Assertions
        expect(mocked(Line_Repository.prototype.findListOfLines).mock.calls.length).toBe(1);


        expect(res._getData()[0].key).toBe("line0");
        expect(res._getData()).toStrictEqual(lines);

        expect(res.statusCode).toBe(200);
    });

    test('List of lines should be obtained -> (success case 1) : Empty list is received ', async () => {

        //Request starts with this valid url
        let req = {
            url : '/listByQuery?typeFilter=name&filter=P&sortBy=name'
        } as Request;

        //Defining the expected return from findListOfLines
        let paths = [];

        //Mock the result of LineRepository.findListOfLines
        Line_Repository.prototype.findListOfLines = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve([]);
        });



        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Line_GetListController;

         serv = new Line_GetListController(new Line_GetListService(new Line_Repository(undefined)));
         await serv.getList(req,res);
         
        //Assertions
        expect(mocked(Line_Repository.prototype.findListOfLines).mock.calls.length).toBe(1);


        expect(res._getData().key).toBe(undefined);
        expect(res._getData()).toStrictEqual([]);

        expect(res.statusCode).toBe(200);
    });

    test('List should not be obtained -> (failure case 1) : typeFilter does not exist', async () => {

        //Request starts with this valid url
        let req = {
            url : '/listByQuery?typeFilter=oi&filter=P&sortBy=name'
        } as Request;

        //Defining the expected return from findListOfLines
        let paths = [];


        //Create a response object
        let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Line_GetListController;
        
         serv = new Line_GetListController(new Line_GetListService(new Line_Repository(undefined)));
         await serv.getList(req,res)
         
        //Assertions

        // expect(res.).toBe("typeFilter must be 'name' or 'key'");

        expect(res.statusCode).toBe(400);
    });

    test('List should not be obtained -> (failure case 1) : typeFilter does not exist', async () => {

        //Request starts with this valid url
        let req = {
            url : '/listByQuery?typeFilter=oi&filter=P&sortBy=name'
        } as Request;

        //Defining the expected return from findListOfLines
        let paths = [];


        //Create a response object
        let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Line_GetListController;
        
         serv = new Line_GetListController(new Line_GetListService(new Line_Repository(undefined)));
         await serv.getList(req,res);
         
        //Assertions

        // expect(res.message).toBe("typeFilter must be 'name' or 'key'");

        expect(res.statusCode).toBe(400);
    });
    test('List should not be obtained -> (failure case 2) : sort does not exist', async () => {

        //Request starts with this valid url
        let req = {
            url : '/listByQuery?typeFilter=name&filter=P&sortBy=oi'
        } as Request;

        //Defining the expected return from findListOfLines
        let paths = [];


        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Line_GetListController;

         serv = new Line_GetListController(new Line_GetListService(new Line_Repository(undefined)));
         await serv.getList(req,res);
         
        //Assertions

        // expect(res.message).toBe("sortBy type must be 'name' or 'key'");

        expect(res.statusCode).toBe(400);
    });
    test('List should not be obtained -> (failure case 3) : filter is missing', async () => {

        //Request starts with this valid url
        let req = {
            url : '/listByQuery?typeFilter=name&sortBy=name'
        } as Request;

        //Defining the expected return from findListOfLines
        let paths = [];


        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Line_GetListController;

         serv = new Line_GetListController(new Line_GetListService(new Line_Repository(undefined)));
         await serv.getList(req,res);
         
        //Assertions

        // expect(res.message).toBe("filter is missing");

        expect(res.statusCode).toBe(400);
    });
    test('List should not be obtained -> (failure case 4) : sort or filter is missing', async () => {

        //Request starts with this valid url
        let req = {
            url : '/listByQuery'
        } as Request;

        //Defining the expected return from findListOfLines
        let paths = [];


        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Line_GetListController;

         serv = new Line_GetListController(new Line_GetListService(new Line_Repository(undefined)));
         await serv.getList(req,res);
         
        //Assertions

        // expect(res.message).toBe("Sort or filter is needed");

        expect(res.statusCode).toBe(400);
    });
});