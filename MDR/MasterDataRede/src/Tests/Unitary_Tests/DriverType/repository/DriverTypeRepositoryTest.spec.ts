import 'reflect-metadata';
import { Request, Response } from 'express';
import { Service, Inject, Container } from 'typedi';
import { mocked } from 'ts-jest/utils';




const Base_Repository  =require('../../../../Repositories/MongoDB_Repositories/Base_Repository/Base_Repository');
import { DriverType_Repository } from '../../../../Repositories/MongoDB_Repositories/DriverType_Repository/DriverType_Repository.js';

//Mock drivertype_repo object
jest.createMockFromModule('../../../../Repositories/MongoDB_Repositories/Base_Repository/Base_Repository');

beforeEach(() => {
    // Clears the record of calls to the mock constructor functions and its methods
   
   
    mocked(Base_Repository).mockClear;
   
});


describe('Filter function', () => {
	

	test('create should work', async () => {

        Base_Repository.prototype.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve("true");
        });


        //Run the Service with the mocks
        let serv : DriverType_Repository;

        serv = new DriverType_Repository(undefined);
        let res;
        const result = await serv.create(undefined);
        //Assertions
        
        
        expect(mocked(Base_Repository.prototype.create).mock.calls.length).toBe(1);

        expect(result).toBe("true");
    });

    test('create should fail ', async () => {

        Base_Repository.prototype.create =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject("failure");
        });


        //Run the Service with the mocks
        let serv : DriverType_Repository;

        serv = new DriverType_Repository(undefined);
        let res;
         await serv.create(undefined).catch((result)=>{
             res=result;
         });
        //Assertions
        
        
        expect(mocked(Base_Repository.prototype.create).mock.calls.length).toBe(1);

        expect(res).toBe("failure");
    });

    test('findByID should fail ', async () => {

        Base_Repository.prototype.findByIdentity =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject("failure");
        });


        //Run the Service with the mocks
        let serv : DriverType_Repository;

        serv = new DriverType_Repository(undefined);
        let res;
        await serv.findByIdentity(undefined).catch((result)=>{
            res=result;
        });
        //Assertions
        
        
        expect(mocked(Base_Repository.prototype.findByIdentity).mock.calls.length).toBe(1);

        expect(res).toBe("failure");
    });

    test('findByID should work ', async () => {

        Base_Repository.prototype.findByIdentity =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve("success");
        });


        //Run the Service with the mocks
        let serv : DriverType_Repository;

        serv = new DriverType_Repository(undefined);
        let res;
        const result = await serv.findByIdentity(undefined);
        //Assertions
        
        
        expect(mocked(Base_Repository.prototype.findByIdentity).mock.calls.length).toBe(1);

        expect(result).toBe("success");
    });

    test('findListObjects should work ', async () => {

        Base_Repository.prototype.findListObjects =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.resolve("success");
        });


        //Run the Service with the mocks
        let serv : DriverType_Repository;

        serv = new DriverType_Repository(undefined);
        let res;
        const result = await serv.findListObjects(undefined,undefined);
        //Assertions
        
        
        expect(mocked(Base_Repository.prototype.findListObjects).mock.calls.length).toBe(1);

        expect(result).toBe("success");
    });

    test('findListObjects should fail ', async () => {

        Base_Repository.prototype.findListObjects =jest.fn().mockImplementation(() : Promise<any> => {
            return Promise.reject("failure");
        });


        //Run the Service with the mocks
        let serv : DriverType_Repository;

        serv = new DriverType_Repository(undefined);
        let res;
        await serv.findListObjects(undefined,undefined)
        .catch((result)=>{
            res=result;
        });
        //Assertions
        
        
        expect(mocked(Base_Repository.prototype.findListObjects).mock.calls.length).toBe(1);

        expect(res).toBe("failure");
    });


});