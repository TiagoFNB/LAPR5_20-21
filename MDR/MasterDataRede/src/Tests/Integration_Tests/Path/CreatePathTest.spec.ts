import { mocked } from 'ts-jest/utils';
import Path_Controller from '../../../Path/controller/Path_Controller';
import {Line_Controller} from '../../../Line/controller/Line_Controller';
import {Line_Repository} from '../../../Repositories/MongoDB_Repositories/Line_Repository/Line_Repository';
import {Node_Repository} from '../../../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository';
import {Path_Repository} from '../../../Repositories/MongoDB_Repositories/Path_Repository/Path_Repository';
import { VehicleType_Repository } from '../../../Repositories/MongoDB_Repositories/VehicleType_Repository/VehicleType_Repository';
import { Path_CreateService } from '../../../Path/services/Path_CreateService';

//Mock path_repo object
jest.createMockFromModule('../../../Repositories/MongoDB_Repositories/Path_Repository/Path_Repository');

//Mock line_repo object
jest.createMockFromModule('../../../Repositories/MongoDB_Repositories/Line_Repository/Line_Repository');

//Mock node_repo object
jest.createMockFromModule('../../../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository');


//Clear all mock implementations before each test
beforeEach(() => {
    // Clears the record of calls to the mock constructor functions and its methods
    mocked(Path_Repository).mockClear;
    mocked(Line_Repository).mockClear;
    mocked(Node_Repository).mockClear;
});

describe('Integration Tests: Create path -> Integration includes controller-service-domain', () => {
    test('New Path should be created -> (success case 1) ', async () => {

        //Request starts with this valid body
        let req = new Object();

        Object.defineProperty(req,"body", {
            value: {
                key: "PathTestIntegrationSuccess",
                line: "line70",
                type: "Go",
                pathSegments: [
                    {
                        node1: "lab3",
                        node2: "lab1",
                        duration: 60,
                        distance: 200
                    },
                    {
                        node1: "lab1",
                        node2: "lab3",
                        duration: 60,
                        distance: 200
                    }
                ],
                isEmpty: false
            }
            
        });

        //Mock the result of PathRepository.create
        Path_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(false);
        });

         //Mock the result of PathRepository.create
         Path_Repository.prototype.create = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve({
                key: "PathTestIntegrationSuccess",
                line: "line70",
                type: "Go",
                pathSegments: [
                    {
                        node1: "lab3",
                        node2: "lab1",
                        duration: 60,
                        distance: 200
                    },
                    {
                        node1: "lab1",
                        node2: "lab3",
                        duration: 60,
                        distance: 200
                    }
                ],
                isEmpty: false
            });
        });

        //Mock the result of NodeRepository.create 
        Line_Repository.prototype.findByIdentity = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve({
                key: "line70",
                name: "line70",
                terminalNode1: "lab3",
                terminalNode2: "lab3",
                RGB: {
                    red : 0,
                    green : 187,
                    blue : 255
                },
                AllowedVehicles: [],
                AllowedDrivers: [],
            });
        });

        //Mock the result of NodeRepository.create 
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });



        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Path_Controller;

         serv = new Path_Controller(new Path_CreateService(new Path_Repository(undefined),new Node_Repository(undefined),new Line_Repository(undefined)));
         await serv.registerPath(req,res);
         
        //Assertions
        expect(mocked(Path_Repository.prototype.exists).mock.calls.length).toBe(1);
        expect(mocked(Path_Repository.prototype.create).mock.calls.length).toBe(1);
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(4);
        expect(mocked(Line_Repository.prototype.findByIdentity).mock.calls.length).toBe(1);


        expect(res._getData().key).toBe("PathTestIntegrationSuccess");
        expect(res._getData().line).toBe("line70");
        expect(res._getData().type).toBe("Go");
        expect(res._getData().pathSegments).toHaveLength(2);
        expect(res._getData().pathSegments[0].node1).toBe("lab3");
        expect(res._getData().pathSegments[1].node1).toBe("lab1");
        expect(res._getData().isEmpty).toBe(false);
        expect(res.statusCode).toBe(201);
    });
    test('New Path should NOT be created, no key -> (fail case 1) ', async () => {

        //Request starts with this valid body
        let req = new Object();

        Object.defineProperty(req,"body", {
            value: {
                key: "",
                line: "line70",
                type: "Go",
                pathSegments: [
                    {
                        node1: "lab3",
                        node2: "lab1",
                        duration: 60,
                        distance: 200
                    },
                    {
                        node1: "lab1",
                        node2: "lab3",
                        duration: 60,
                        distance: 200
                    }
                ],
                isEmpty: false
            }
            
        });

        //Mock the result of PathRepository.create
        Path_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(false);
        });

         //Mock the result of PathRepository.create
         Path_Repository.prototype.create = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject();
        });

        //Mock the result of NodeRepository.create 
        Line_Repository.prototype.findByIdentity = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve({
                key: "line70",
                name: "line70",
                terminalNode1: "lab3",
                terminalNode2: "lab3",
                RGB: {
                    red : 0,
                    green : 187,
                    blue : 255
                },
                AllowedVehicles: [],
                AllowedDrivers: [],
            });
        });

        //Mock the result of NodeRepository.create 
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });



        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Path_Controller;

         serv = new Path_Controller(new Path_CreateService(new Path_Repository(undefined),new Node_Repository(undefined),new Line_Repository(undefined)));
         await serv.registerPath(req,res);
         
        //Assertions
        expect(mocked(Path_Repository.prototype.exists).mock.calls.length).toBe(1);
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(4);
        expect(mocked(Line_Repository.prototype.findByIdentity).mock.calls.length).toBe(1);


        expect(res._getData()).toBe("Error creating Path.");
        expect(res.statusCode).toBe(400);
    });

    test('New Path should NOT be created, duplicate key -> (fail case 2) ', async () => {

        //Request starts with this valid body
        let req = new Object();

        Object.defineProperty(req,"body", {
            value: {
                key: "PathTestIntegrationSuccess",
                line: "line70",
                type: "Go",
                pathSegments: [
                    {
                        node1: "lab3",
                        node2: "lab1",
                        duration: 60,
                        distance: 200
                    },
                    {
                        node1: "lab1",
                        node2: "lab3",
                        duration: 60,
                        distance: 200
                    }
                ],
                isEmpty: false
            }
            
        });

        //Mock the result of PathRepository.create
        Path_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });



        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Path_Controller;

         serv = new Path_Controller(new Path_CreateService(new Path_Repository(undefined),new Node_Repository(undefined),new Line_Repository(undefined)));
         await serv.registerPath(req,res);
         
        //Assertions
        expect(mocked(Path_Repository.prototype.exists).mock.calls.length).toBe(1);


        expect(res._getData()).toBe("Duplicated Path, key already in use :(");
        expect(res.statusCode).toBe(400);
    });

    test('New Path should NOT be created, no existing line -> (fail case 3) ', async () => {

        //Request starts with this valid body
        let req = new Object();

        Object.defineProperty(req,"body", {
            value: {
                key: "PathTestIntegrationSuccess",
                line: "line70",
                type: "Go",
                pathSegments: [
                    {
                        node1: "lab3",
                        node2: "lab1",
                        duration: 60,
                        distance: 200
                    },
                    {
                        node1: "lab1",
                        node2: "lab3",
                        duration: 60,
                        distance: 200
                    }
                ],
                isEmpty: false
            }
            
        });

        //Mock the result of PathRepository.create
        Path_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(false);
        });


        //Mock the result of NodeRepository.create 
        Line_Repository.prototype.findByIdentity = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(null);
        });




        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Path_Controller;

         serv = new Path_Controller(new Path_CreateService(new Path_Repository(undefined),new Node_Repository(undefined),new Line_Repository(undefined)));
         await serv.registerPath(req,res);
         
        //Assertions
        expect(mocked(Path_Repository.prototype.exists).mock.calls.length).toBe(1);
        expect(mocked(Line_Repository.prototype.findByIdentity).mock.calls.length).toBe(1);


        expect(res._getData()).toBe("Line wasn't found");
        expect(res.statusCode).toBe(400);
    });

    test('New Path should NOT be created, Terminal nodes not the same as the one in path -> (fail case 4) ', async () => {

        //Request starts with this valid body
        let req = new Object();

        Object.defineProperty(req,"body", {
            value: {
                key: "PathTestIntegrationSuccess",
                line: "line70",
                type: "Go",
                pathSegments: [
                    {
                        node1: "lab3",
                        node2: "lab1",
                        duration: 60,
                        distance: 200
                    },
                    {
                        node1: "lab1",
                        node2: "lab3",
                        duration: 60,
                        distance: 200
                    }
                ],
                isEmpty: false
            }
            
        });

        //Mock the result of PathRepository.create
        Path_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(false);
        });

         //Mock the result of PathRepository.create
         Path_Repository.prototype.create = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve({
                key: "PathTestIntegrationSuccess",
                line: "line70",
                type: "Go",
                pathSegments: [
                    {
                        node1: "lab3",
                        node2: "lab1",
                        duration: 60,
                        distance: 200
                    },
                    {
                        node1: "lab1",
                        node2: "lab3",
                        duration: 60,
                        distance: 200
                    }
                ],
                isEmpty: false
            });
        });

        //Mock the result of NodeRepository.create 
        Line_Repository.prototype.findByIdentity = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve({
                key: "line70",
                name: "line70",
                terminalNode1: "lab1",
                terminalNode2: "lab1",
                RGB: {
                    red : 0,
                    green : 187,
                    blue : 255
                },
                AllowedVehicles: [],
                AllowedDrivers: [],
            });
        });

        //Mock the result of NodeRepository.create 
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });



        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Path_Controller;

         serv = new Path_Controller(new Path_CreateService(new Path_Repository(undefined),new Node_Repository(undefined),new Line_Repository(undefined)));
         await serv.registerPath(req,res);
         
        //Assertions
        expect(mocked(Path_Repository.prototype.exists).mock.calls.length).toBe(1);
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(4);
        expect(mocked(Line_Repository.prototype.findByIdentity).mock.calls.length).toBe(1);

        expect(res._getData()).toBe("TerminalNodes (lab1,lab1) from Line (line70) are NOT EQUAL to 1st and Last Node of the Path : (lab3,lab3)");
        expect(res.statusCode).toBe(400);
    });

    test('New Path should NOT be created, nodes from path dont exist -> (fail case 5) ', async () => {

        //Request starts with this valid body
        let req = new Object();

        Object.defineProperty(req,"body", {
            value: {
                key: "PathTestIntegrationSuccess",
                line: "line70",
                type: "Go",
                pathSegments: [
                    {
                        node1: "RandomNodeFreeError",
                        node2: "lab1",
                        duration: 60,
                        distance: 200
                    },
                    {
                        node1: "lab1",
                        node2: "lab3",
                        duration: 60,
                        distance: 200
                    }
                ],
                isEmpty: false
            }
            
        });

        //Mock the result of PathRepository.create
        Path_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(false);
        });

         
        //Mock the result of NodeRepository.create 
        Line_Repository.prototype.findByIdentity = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve({
                key: "line70",
                name: "line70",
                terminalNode1: "lab1",
                terminalNode2: "lab1",
                RGB: {
                    red : 0,
                    green : 187,
                    blue : 255
                },
                AllowedVehicles: [],
                AllowedDrivers: [],
            });
        });

        //Mock the result of NodeRepository.create 
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(false);
        });



        //Create a response object
         let res = require('node-mocks-http').createResponse();

         //Run the Controller with the repository mocks
         let serv : Path_Controller;

         serv = new Path_Controller(new Path_CreateService(new Path_Repository(undefined),new Node_Repository(undefined),new Line_Repository(undefined)));
         await serv.registerPath(req,res);
         
        //Assertions
        expect(mocked(Path_Repository.prototype.exists).mock.calls.length).toBe(1);
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(1);
        expect(mocked(Line_Repository.prototype.findByIdentity).mock.calls.length).toBe(1);

        expect(res._getData()).toBe("RandomNodeFreeError doesnt exist in the DB");
        expect(res.statusCode).toBe(400);
    });
});