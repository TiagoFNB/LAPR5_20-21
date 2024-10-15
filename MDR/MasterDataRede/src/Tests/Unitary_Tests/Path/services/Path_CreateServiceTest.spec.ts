
import { mocked } from 'ts-jest/utils';
import {Line_Repository} from '../../../../Repositories/MongoDB_Repositories/Line_Repository/Line_Repository';
import {Node_Repository} from '../../../../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository';
import {Path_Repository} from '../../../../Repositories/MongoDB_Repositories/Path_Repository/Path_Repository';
import {DriverType_Repository} from '../../../../Repositories/MongoDB_Repositories/DriverType_Repository/DriverType_Repository';
import {Path} from '../../../../Path/domain/Path';
import {Path_DtoMapper} from '../../../../Path/mappers/Path_DtoMapper';
import { Path_CreateService } from '../../../../Path/services/Path_CreateService';
import {IDTO_Path} from '../../../../Path/interfaces/IDTO_Path';

//Mock line object
jest.createMockFromModule('../../../../Path/domain/Path');

//Mock line_repo object
jest.createMockFromModule('../../../../Repositories/MongoDB_Repositories/Path_Repository/Path_Repository');

//Mock node_repo object
jest.createMockFromModule('../../../../Repositories/MongoDB_Repositories/Line_Repository/Line_Repository');

//Mock drivertype_repo object
jest.createMockFromModule('../../../../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository');

//Mock mapper object
jest.createMockFromModule('../../../../Path/mappers/Path_DtoMapper');


//Clear all mock implementations before each test
beforeEach(() => {
    // Clears the record of calls to the mock constructor functions and its methods
    mocked(Path.create).mockClear;
    mocked(Line_Repository).mockClear;
    mocked(Node_Repository).mockClear;
    mocked(Path_Repository).mockClear;
    mocked(Path_DtoMapper).mockClear;
});

describe('Create path test', () => {
    test('registerPath should create a new line (success case 1)', async () => {
        //Create fake domain object

        let object = {
            key: "pathTest2",
            line: "line1",
            type: "Go",
            pathSegments: [
                {
                node1: "lab1",
                node2: "lab2",
                duration: 50,
                distance: 100
                }
            ]
         }

        let l : Path_CreateService;
        l = new Object() as Path_CreateService;
        
        // //terminalNode1 contains shortname
        // Object.defineProperty(l,'key',{
        //     get : jest.fn(() => {
        //         let o = new Object();
        //         Object.defineProperty(o,'key',{
        //             get : jest.fn(()=>"path1000")
        //         });
        //         return o;})
        // });

        // //terminalNode2 contains shortname
        // Object.defineProperty(l,'line',{
        //     get : jest.fn(() => {
        //         let o = new Object();
        //         Object.defineProperty(o,'line',{
        //             get : jest.fn(()=>"")
        //         });
        //         return o;})
        // });

        // Object.defineProperty(l,'type',{
        //     get : jest.fn(() => {
        //         let o = new Object();
        //         Object.defineProperty(o,'type',{
        //             get : jest.fn(()=>"")
        //         });
        //         return o;})
        // });

        // Object.defineProperty(l,'pathSegments',{
        //     get : jest.fn(() => {
        //         let o = new Object();
        //         Object.defineProperty(o,'pathSegments',{
        //             get : jest.fn(()=>"")
        //         });
        //         return o;})
        // });

        //Mock the result of Line.create 
        //(return only matters as object L because we need to compare the size of arrays inside it)
        
        Path_Repository.prototype.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(object);
        });

        Path.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(object);
        });

        Path_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(false);
        });

        //Mock the result of LineRepository.create (result doesn't matter as well, as long as it is wrapped in the resolved Promise)
        Line_Repository.prototype.findByIdentity = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve({key:"line1",name:"name1",terminalNode1:"lab1",terminalNode2:"lab2",allowedDrivers:[],allowedVehicles:[]});
        });

        //Mock the result of Node_Repository.exists to return true
        Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });

        //Mock the mapper functions
        Path_DtoMapper.mapDTO2Domain = jest.fn().mockImplementation(() : any => {
            return {
                key: "pathTest2",
                line: "line1",
                type: "Go",
                pathSegments: [
                    {
                    node1: "lab1",
                    node2: "lab2",
                    duration: 50,
                    distance: 100
                    }
                ]
             };
        });

        Path_DtoMapper.mapDomain2Persistence_Path = jest.fn().mockImplementation(() : any => {
            return "result";
        });

        Path_DtoMapper.map2Dto_Path = jest.fn().mockImplementation(() : any => {
            return object;
        });

        //Run the Service with the mocks
        let serv : Path_CreateService;

        let obj = {
            key: "pathTest2",
            line: "line1",
            type: "Go",
            pathSegments: [
                {
                node1: "lab1",
                node2: "lab2",
                duration: 50,
                distance: 100
                }
            ]
         }

        serv = new Path_CreateService(new Path_Repository({}),new Node_Repository({}),new Line_Repository({}));
        let result;
        await serv.registerPath(obj)
        .then((res)=>{
            result = res;
        })

         //Assertions
        expect(mocked(Path.create).mock.calls.length).toBe(1);
        expect(mocked(Line_Repository.prototype.findByIdentity).mock.calls.length).toBe(1);
        expect(mocked(Node_Repository.prototype.exists).mock.calls.length).toBe(2);
        expect(mocked(Path_DtoMapper.map2Dto_Path).mock.calls.length).toBe(1);
        expect(mocked(Path_DtoMapper.mapDTO2Domain).mock.calls.length).toBe(1);
        expect(mocked(Path_DtoMapper.mapDomain2Persistence_Path).mock.calls.length).toBe(1);

        expect(result).toBe(object);
    }),
    test('registerPath should NOT create a new path, path has a duplicated key (fail case 1)', async () => {

        Path_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });

        //Run the Service with the mocks
        let serv : Path_CreateService;

        serv = new Path_CreateService(new Path_Repository({}),new Node_Repository({}),new Line_Repository({}));

        let obj = {
            key: "path1",
            line: "line1",
            type: "Go",
            pathSegments: [
                {
                node1: "lab1",
                node2: "lab2",
                duration: 50,
                distance: 100
                }
            ]
         }


        let result;
        await serv.registerPath(obj)
        .catch((err) => {
            result = err;
        });

        expect(mocked(Path_Repository.prototype.exists).mock.calls.length).toBe(1);

        expect(result.message).toBe('Duplicated Path, key already in use :(');
});
test('registerPath should NOT create a new path, Line that dont exist (fail case 2)', async () => {

    Path_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
        return Promise.resolve(false);
    });

    Line_Repository.prototype.findByIdentity = jest.fn().mockImplementation(() : Promise<any> => {
        return Promise.resolve(null);
    });

    //Run the Service with the mocks
    let serv : Path_CreateService;

    serv = new Path_CreateService(new Path_Repository({}),new Node_Repository({}),new Line_Repository({}));

    let obj2 = {
        key: "pathTest1",
        line: "",
        type: "Go",
        pathSegments: [
            {
            node1: "lab1",
            node2: "lab2",
            duration: 50,
            distance: 100
            }
        ]
     }


    let result;
    await serv.registerPath(obj2)
    .catch((err) => {
        result = err;
    });

    expect(mocked(Path_Repository.prototype.exists).mock.calls.length).toBe(1);

    expect(result.message).toBe("Line wasn't found");
});
test('registerPath should NOT create a new path, Line terminal nodes are diferent than the ones added (fail case 3)', async () => {

    let obj2 = {
        key: "pathTest3",
        line: "line70",
        type: "Go",
        pathSegments: [
            {
            node1: "lab1",
            node2: "lab2",
            duration: 50,
            distance: 100
            }
        ]
     };

    //Mock the mapper functions
    Path_DtoMapper.mapDTO2Domain = jest.fn().mockImplementation(() : any => {
        return obj2;
    });

    Path_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
        return Promise.resolve(false);
    });

    //Mock the result of LineRepository.create (result doesn't matter as well, as long as it is wrapped in the resolved Promise)
    Line_Repository.prototype.findByIdentity = jest.fn().mockImplementation(() : Promise<any> => {
        return Promise.resolve({key:"line70",name:"name1",terminalNode1:"lab3",terminalNode2:"lab3",allowedDrivers:[],allowedVehicles:[]});
    });

    //Mock the result of Node_Repository.exists to return true
    Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
        return Promise.resolve(true);
    });

    //Run the Service with the mocks
    let serv : Path_CreateService;

    serv = new Path_CreateService(new Path_Repository({}),new Node_Repository({}),new Line_Repository({}));


    let result;
    await serv.registerPath(obj2)
    .catch((err) => {
        result = err;
    });

    expect(mocked(Path_Repository.prototype.exists).mock.calls.length).toBe(1);

    expect(result.message).toBe('TerminalNodes (lab3,lab3) from Line (line70) are NOT EQUAL to 1st and Last Node of the Path : (lab1,lab2)');
});
test('registerPath should NOT create a new path, Path with nodes that dont exist (fail case 4)', async () => {

    let obj3 = {
        key: "pathTest4",
        line: "line70",
        type: "Go",
        pathSegments: [
            {
            node1: "laboioi1",
            node2: "laboioi2",
            duration: 50,
            distance: 100
            }
        ]
     };

    //Mock the mapper functions
    Path_DtoMapper.mapDTO2Domain = jest.fn().mockImplementation(() : any => {
        return obj3;
    });

    Path_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
        return Promise.resolve(false);
    });

    //Mock the result of LineRepository.create (result doesn't matter as well, as long as it is wrapped in the resolved Promise)
    Line_Repository.prototype.findByIdentity = jest.fn().mockImplementation(() : Promise<any> => {
        return Promise.resolve({key:"line70",name:"name1",terminalNode1:"lab3",terminalNode2:"lab3",allowedDrivers:[],allowedVehicles:[]});
    });

    //Mock the result of Node_Repository.exists to return true
    Node_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
        return Promise.resolve(false);
    });

    //Run the Service with the mocks
    let serv : Path_CreateService;

    serv = new Path_CreateService(new Path_Repository({}),new Node_Repository({}),new Line_Repository({}));


    let result;
    await serv.registerPath(obj3)
    .catch((err) => {
        result = err;
    });

    expect(mocked(Path_Repository.prototype.exists).mock.calls.length).toBe(1);

    expect(result.message).toBe('laboioi1 doesnt exist in the DB');
});

})