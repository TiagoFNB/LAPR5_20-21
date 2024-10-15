import { mocked } from 'ts-jest/utils';
import { Line_Controller } from '../../../Line/controller/Line_Controller';
import {Line_Repository} from '../../../Repositories/MongoDB_Repositories/Line_Repository/Line_Repository';
import {Node_Repository} from '../../../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository';
import {DriverType_Repository} from '../../../Repositories/MongoDB_Repositories/DriverType_Repository/DriverType_Repository';
import { VehicleType_Repository } from '../../../Repositories/MongoDB_Repositories/VehicleType_Repository/VehicleType_Repository';
import { Line_CreateService } from '../../../Line/services/Line_CreateService';

//Mock line_repo object
jest.createMockFromModule('../../../Repositories/MongoDB_Repositories/Line_Repository/Line_Repository');

//Mock node_repo object
jest.createMockFromModule('../../../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository');

//Mock node_repo object
jest.createMockFromModule('../../../Repositories/MongoDB_Repositories/VehicleType_Repository/VehicleType_Repository');

//Mock node_repo object
jest.createMockFromModule('../../../Repositories/MongoDB_Repositories/DriverType_Repository/DriverType_Repository');

//Clear all mock implementations before each test
beforeEach(() => {
    // Clears the record of calls to the mock constructor functions and its methods
    mocked(Line_Repository).mockClear;
    mocked(Node_Repository).mockClear;
    mocked(DriverType_Repository).mockClear;
    mocked(VehicleType_Repository).mockClear;
});

describe('Integration Tests: Create line -> Integration includes controller-service-domain', () => {
    test('New Line should be created -> (success case 1) ', async () => {

        //Request starts with this valid body
        let req = new Object();

        Object.defineProperty(req,"body", {
            value: {
                key: "line1",
                name: "name1",
                terminalNode1: "term1",
                terminalNode2: "term2",
                RGB: {
                    red : 0,
                    green : 187,
                    blue : 255
                },
                AllowedVehicles: ["veic1","veic2"],
                AllowedDrivers: ["driv1","driv2"],
            }
        });

        
        //Mock the result of LineRepository.create 
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });
        
        //Mock the result of LineRepository.create 
        DriverType_Repository.prototype.findListObjects = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(["2","elements"]);
        });
        
        //Mock the result of LineRepository.create 
        VehicleType_Repository.prototype.findListObjects = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(["2","elements"]);
        });

        //Mock the result of LineRepository.create
        Line_Repository.prototype.create = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve({
                key: "line1",
                name: "name1",
                terminalNode1: "term1",
                terminalNode2: "term2",
                RGB: {
                    red : 0,
                    green : 187,
                    blue : 255
                },
                AllowedVehicles: ["veic1","veic2"],
                AllowedDrivers: ["driv1","driv2"],
            });
        });


        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Line_Controller;

         serv = new Line_Controller(new Line_CreateService(new Line_Repository(undefined),new Node_Repository(undefined),new DriverType_Repository(undefined), new VehicleType_Repository(undefined)));
         await serv.registerLine(req,res);
         
        //Assertions
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(2);
        expect(mocked(DriverType_Repository.prototype.findListObjects).mock.calls.length).toBe(1);
        expect(mocked(VehicleType_Repository.prototype.findListObjects).mock.calls.length).toBe(1);
        expect(mocked(Line_Repository.prototype.create).mock.calls.length).toBe(1);



        expect(res._getData().key).toBe("line1");
        expect(res._getData().name).toBe("name1");
        expect(res._getData().terminalNode1).toBe("term1");
        expect(res._getData().terminalNode2).toBe("term2");

        expect(res.statusCode).toBe(201);
    });

    test('New Line should be created -> (success case 2) ', async () => {

        //Request starts with this valid body
        let req = new Object();

        Object.defineProperty(req,"body", {
            value: {
                key: "line2",
                name: "name2",
                terminalNode1: "term3",
                terminalNode2: "term4",
                RGB: {
                    red : 0,
                    green : 0,
                    blue : 0
                },
                AllowedVehicles: ["veic1"],
                AllowedDrivers: []
            }
        });

        
        //Mock the result of LineRepository.create 
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });
        
        //Mock the result of LineRepository.create 
        DriverType_Repository.prototype.findListObjects = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve([]);
        });
        
        //Mock the result of LineRepository.create 
        VehicleType_Repository.prototype.findListObjects = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(["1element"]);
        });

        //Mock the result of LineRepository.create
        Line_Repository.prototype.create = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve({
                key: "line2",
                name: "name2",
                terminalNode1: "term3",
                terminalNode2: "term4",
                RGB: {
                    red : 0,
                    green : 0,
                    blue : 0
                },
                AllowedVehicles: ["veic1"],
                AllowedDrivers: []
            });
        });


        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Line_Controller;

         serv = new Line_Controller(new Line_CreateService(new Line_Repository(undefined),new Node_Repository(undefined),new DriverType_Repository(undefined), new VehicleType_Repository(undefined)));
         await serv.registerLine(req,res);
         
        //Assertions
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(2);
        expect(mocked(DriverType_Repository.prototype.findListObjects).mock.calls.length).toBe(1);
        expect(mocked(VehicleType_Repository.prototype.findListObjects).mock.calls.length).toBe(1);
        expect(mocked(Line_Repository.prototype.create).mock.calls.length).toBe(1);



        expect(res._getData().key).toBe("line2");
        expect(res._getData().name).toBe("name2");
        expect(res._getData().terminalNode1).toBe("term3");
        expect(res._getData().terminalNode2).toBe("term4");

        expect(res.statusCode).toBe(201);
    });

    test('New Line should not be created -> (failure case 1) : invalid fields detected in line constructor ', async () => {

        //Request starts with this valid body
        let req = new Object();

        Object.defineProperty(req,"body", {
            value: {
                key: "line2",
                name: "name2",
                terminalNode1: "term3",
                terminalNode2: "term4",
                RGB: {
                    red : 256, //This field is invalid
                    green : 0,
                    blue : 0
                },
                AllowedVehicles: ["veic1"],
                AllowedDrivers: []
            }
        });

        
        //Mock the result of LineRepository.create 
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });

        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Line_Controller;

         serv = new Line_Controller(new Line_CreateService(new Line_Repository(undefined),new Node_Repository(undefined),new DriverType_Repository(undefined), new VehicleType_Repository(undefined)));
         await serv.registerLine(req,res);
         
        //Assertions
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(0);

        expect(res._getData()).toBe("child \"red\" fails because [\"red\" must be less than or equal to 255]");

        expect(res.statusCode).toBe(400);
    });

    test('New Line should not be created -> (failure case 2) : terminal node does not exist ', async () => {

        //Request starts with this valid body
        let req = new Object();

        Object.defineProperty(req,"body", {
            value: {
                key: "line1",
                name: "name1",
                terminalNode1: "term1",
                terminalNode2: "term2",
                RGB: {
                    red : 0,
                    green : 187,
                    blue : 255
                },
                AllowedVehicles: ["veic1","veic2"],
                AllowedDrivers: ["driv1","driv2"],
            }
        });

        
        //Mock the result of LineRepository.create 
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(false);
        });
        
        //Mock the result of LineRepository.create 
        DriverType_Repository.prototype.findListObjects = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(["2","elements"]);
        });

        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Line_Controller;

         serv = new Line_Controller(new Line_CreateService(new Line_Repository(undefined),new Node_Repository(undefined),new DriverType_Repository(undefined), new VehicleType_Repository(undefined)));
         await serv.registerLine(req,res);
         
        //Assertions
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(1);
        expect(mocked(DriverType_Repository.prototype.findListObjects).mock.calls.length).toBe(0);

        expect(res._getData()).toBe("Terminal Node: term1 does not exist.");

        expect(res.statusCode).toBe(400);
    });

    test('New Line should not be created -> (failure case 3) : not all elements in the driver array exist in the db', async () => {
        //Request starts with this valid body
        let req = new Object();

        Object.defineProperty(req,"body", {
            value: {
                key: "line2",
                name: "name2",
                terminalNode1: "term3",
                terminalNode2: "term4",
                RGB: {
                    red : 0,
                    green : 0,
                    blue : 0
                },
                AllowedVehicles: [],
                AllowedDrivers: ["driver1"]
            }
        });
        
        //Mock the result of LineRepository.create 
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });
        
        //Mock the result of LineRepository.create 
        DriverType_Repository.prototype.findListObjects = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve([]);
        });
        
        //Mock the result of LineRepository.create 
        VehicleType_Repository.prototype.findListObjects = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(["1element"]);
        });

        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Line_Controller;

         serv = new Line_Controller(new Line_CreateService(new Line_Repository(undefined),new Node_Repository(undefined),new DriverType_Repository(undefined), new VehicleType_Repository(undefined)));
         await serv.registerLine(req,res);
         
        //Assertions
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(2);
        expect(mocked(DriverType_Repository.prototype.findListObjects).mock.calls.length).toBe(1);
        expect(mocked(VehicleType_Repository.prototype.findListObjects).mock.calls.length).toBe(0);

        expect(res._getData()).toBe("At least one of the driver types in the list is invalid.");
        expect(res.statusCode).toBe(400);
    });

    test('New Line should not be created -> (failure case 4) : not all elements in the vehicle array exist in the db', async () => {
        //Request starts with this valid body
        let req = new Object();

        Object.defineProperty(req,"body", {
            value: {
                key: "line2",
                name: "name2",
                terminalNode1: "term3",
                terminalNode2: "term4",
                RGB: {
                    red : 0,
                    green : 0,
                    blue : 0
                },
                AllowedVehicles: ["vehic1"],
                AllowedDrivers: []
            }
        });
        
        //Mock the result of LineRepository.create 
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });
        
        //Mock the result of LineRepository.create 
        DriverType_Repository.prototype.findListObjects = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve([]);
        });
        
        //Mock the result of LineRepository.create 
        VehicleType_Repository.prototype.findListObjects = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve([]);
        });

        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Line_Controller;

         serv = new Line_Controller(new Line_CreateService(new Line_Repository(undefined),new Node_Repository(undefined),new DriverType_Repository(undefined), new VehicleType_Repository(undefined)));
         await serv.registerLine(req,res);
         
        //Assertions
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(2);
        expect(mocked(DriverType_Repository.prototype.findListObjects).mock.calls.length).toBe(1);
        expect(mocked(VehicleType_Repository.prototype.findListObjects).mock.calls.length).toBe(1);

        expect(res._getData()).toBe("At least one of the vehicle types in the list is invalid.");
        expect(res.statusCode).toBe(400);
    });


});