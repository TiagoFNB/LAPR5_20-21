import { mocked } from 'ts-jest/utils';
import {Line_Repository} from '../../../../Repositories/MongoDB_Repositories/Line_Repository/Line_Repository';
import {Line_DtoMapper} from '../../../../Line/mappers/Line_DtoMapper';
import { Line_GetPathsService } from '../../../../Line/services/Line_GetPathsService';
import {Path_Repository} from '../../../../Repositories/MongoDB_Repositories/Path_Repository/Path_Repository';


//Mock line_repo object
jest.createMockFromModule('../../../../Repositories/MongoDB_Repositories/Line_Repository/Line_Repository');

//Mock path_repo object
jest.createMockFromModule('../../../../Repositories/MongoDB_Repositories/Path_Repository/Path_Repository');

//Mock mapper object
jest.createMockFromModule('../../../../Line/mappers/Line_DtoMapper');


//Clear all mock implementations before each test
beforeEach(() => {
    // Clears the record of calls to the mock constructor functions and its methods
    mocked(Line_Repository).mockClear;
    mocked(Line_DtoMapper).mockClear;
    mocked(Path_Repository).mockClear;  
});

describe('List line Paths tests', () => {
    test('GetPathsService should list all paths of a line (success case 1)', async () => {

        //Mock the result of LineRepository.exists, needs to return true for it to be a success
        Line_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });

         //Mock the result of LineRepository.findPathsOfLine, return doesn't matter
        Path_Repository.prototype.findPathsOfLine = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve();
        });

        //Mock the mapper functions
        Line_DtoMapper.map2Dto_Line_Paths = jest.fn().mockImplementation(() : any => {
            return  Promise.resolve("success");;
        });

        //Run the Service with the mocks
        let serv : Line_GetPathsService;

        serv = new Line_GetPathsService(new Line_Repository(undefined),new Path_Repository(undefined));
        let result;
        await serv.getPathsService({key : 'line'}).then(res => result = res);

        //Assertions
        expect(mocked(Line_Repository.prototype.exists).mock.calls.length).toBe(1);
        expect(mocked(Path_Repository.prototype.findPathsOfLine).mock.calls.length).toBe(1);
        expect(mocked(Line_DtoMapper.map2Dto_Line_Paths).mock.calls.length).toBe(1);

        expect(result).toBe("success");
    });

    test('GetPathsService should not list paths of a line (failure case 1) : line does not exist in db', async () => {

        //Mock the result of LineRepository.exists, needs to return true for it to be a success
        Line_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(false);
        });

        //Mock the result of LineRepository.findPathsOfLine, return doesn't matter
        Path_Repository.prototype.findPathsOfLine = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve();
        });

        //Run the Service with the mocks
        let serv : Line_GetPathsService;

        serv = new Line_GetPathsService(new Line_Repository(undefined),new Path_Repository(undefined));
        let result;
        await serv.getPathsService({key : 'line'}).catch(res => result = res);

        //Assertions
        expect(mocked(Line_Repository.prototype.exists).mock.calls.length).toBe(1);
        expect(mocked(Path_Repository.prototype.findPathsOfLine).mock.calls.length).toBe(0);

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe("Line with id: line does not exist.");
    });

    test('GetPathsService should not list paths of a line (failure case 2) : error in db while checking if line exists', async () => {

        //Mock the result of LineRepository.exists, needs to resolve true for it to be a success
        Line_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject("error");
        });

        //Mock the result of LineRepository.findPathsOfLine, return doesn't matter
        Path_Repository.prototype.findPathsOfLine = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve();
        });

        //Run the Service with the mocks
        let serv : Line_GetPathsService;

        serv = new Line_GetPathsService(new Line_Repository(undefined),new Path_Repository(undefined));
        let result;
        await serv.getPathsService({key : 'line'}).catch(res => result = res);

        //Assertions
        expect(mocked(Line_Repository.prototype.exists).mock.calls.length).toBe(1);
        expect(mocked(Path_Repository.prototype.findPathsOfLine).mock.calls.length).toBe(0);

        expect(result).toBe("error");
    });

    test('GetPathsService should not list paths of a line (failure case 3) : error in db while finding paths of a line', async () => {

        //Mock the result of LineRepository.exists, needs to return true for it to be a success
        Line_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });

         //Mock the result of LineRepository.findPathsOfLine, result will be whatever is rejected
        Path_Repository.prototype.findPathsOfLine = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject("error");
        });

        //Mock the mapper functions
        Line_DtoMapper.map2Dto_Line_Paths = jest.fn().mockImplementation(() : any => {
            return  Promise.resolve();
        });

        //Run the Service with the mocks
        let serv : Line_GetPathsService;

        serv = new Line_GetPathsService(new Line_Repository(undefined),new Path_Repository(undefined));
        let result;
        await serv.getPathsService({key : 'line'}).catch(res => result = res);

        //Assertions
        expect(mocked(Line_Repository.prototype.exists).mock.calls.length).toBe(1);
        expect(mocked(Path_Repository.prototype.findPathsOfLine).mock.calls.length).toBe(1);
        expect(mocked(Line_DtoMapper.map2Dto_Line_Paths).mock.calls.length).toBe(0);

        expect(result).toBe("error");
    });


    test('GetPathsService should not list paths of a line (failure case 4) : error occurs in mapper', async () => {

        //Mock the result of LineRepository.exists, needs to return true for it to be a success
        Line_Repository.prototype.exists = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve(true);
        });

         //Mock the result of LineRepository.findPathsOfLine, return does not matter
        Path_Repository.prototype.findPathsOfLine = jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve();
        });

        //Mock the mapper functions
        Line_DtoMapper.map2Dto_Line_Paths = jest.fn().mockImplementation(() : any => {
            return  Promise.reject("error in mapper");
        });

        //Run the Service with the mocks
        let serv : Line_GetPathsService;

        serv = new Line_GetPathsService(new Line_Repository(undefined),new Path_Repository(undefined));
        let result;
        await serv.getPathsService({key : 'line'}).catch(res => result = res);

        //Assertions
        expect(mocked(Line_Repository.prototype.exists).mock.calls.length).toBe(1);
        expect(mocked(Path_Repository.prototype.findPathsOfLine).mock.calls.length).toBe(1);
        expect(mocked(Line_DtoMapper.map2Dto_Line_Paths).mock.calls.length).toBe(1);

        expect(result).toBe("error in mapper");
    });
});