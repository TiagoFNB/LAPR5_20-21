import 'reflect-metadata';
import { Request, Response } from 'express';
import { Service, Inject, Container } from 'typedi';
import { mocked } from 'ts-jest/utils';

const Base_Repository  = require('../../../../Repositories/MongoDB_Repositories/Path_Repository/Path_Repository');
import { Path_Repository } from '../../../../Repositories/MongoDB_Repositories/Path_Repository/Path_Repository';

//Mock Path_repo object
jest.createMockFromModule('../../../../Repositories/MongoDB_Repositories/Base_Repository/Base_Repository');

beforeEach(() => {
    // Clears the record of calls to the mock constructor functions and its methods
   
    mocked(Base_Repository).mockClear;
   
});


describe('Filter function', () => {
	

	test('create should work', async () => {

        Path_Repository.prototype.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve("true");
        });




        //Run the Service with the mocks
        let serv : Path_Repository;

        serv = new Path_Repository(undefined);
        let res;
        const result = await serv.create(undefined);
        //Assertions
        
        
        expect(mocked(Path_Repository.prototype.create).mock.calls.length).toBe(1);

        expect(result).toBe("true");
    });

    test('create should fail ', async () => {

        Path_Repository.prototype.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject("failure");
        });


        //Run the Service with the mocks
        let serv : Path_Repository;

        serv = new Path_Repository(undefined);
        let res;
         await serv.create(undefined).catch((result)=>{
             res=result;
         });
        //Assertions
        
        
        expect(mocked(Path_Repository.prototype.create).mock.calls.length).toBe(1);

        expect(res).toBe("failure");
    });


});