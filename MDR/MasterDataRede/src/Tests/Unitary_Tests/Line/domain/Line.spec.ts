import { Line } from '../../../../Line/domain/Line';

describe('Create line domain test', () => {
    test('New line object should be created with all possible atributes (success case 1)', async () => {
        
        let dto = {
            key: "line1",
            name: "name1",
            terminalNode1: "term1",
            terminalNode2: "term2",
            RGB: {
              red : 0,
              green : 10,
              blue : 255
            },
            AllowedVehicles: ["vehic1","vehic2"],
            AllowedDrivers: ["driv1","driv2"]};

        let result: Line;
        await Line.create(dto).then(res => result = res);

        //Assertions
        expect(result).toBeInstanceOf(Line);

    });

    test('New line object should be created without RGB  (success case 2)', async () => {
        
        let dto = {
            key: "line1",
            name: "name1",
            terminalNode1: "term1",
            terminalNode2: "term2",
            AllowedVehicles: ["vehic1","vehic2"],
            AllowedDrivers: ["driv1","driv2"]};

        let result: Line;
        await Line.create(dto).then(res => result = res);

        //Assertions
        expect(result).toBeInstanceOf(Line);

    });

    test('New line object should be created without Vehicles  (success case 3)', async () => {
        
        let dto = {
            key: "line1",
            name: "name1",
            terminalNode1: "term1",
            terminalNode2: "term2",
            RGB: {
              red : 0,
              green : 10,
              blue : 255
            },
            AllowedVehicles: [],
            AllowedDrivers: ["driv1","driv2"]};

        let result: Line;
        await Line.create(dto).then(res => result = res);

        //Assertions
        expect(result).toBeInstanceOf(Line);

    });

    test('New line object should be created without Drivers  (success case 4)', async () => {
        
        let dto = {
            key: "line1",
            name: "name1",
            terminalNode1: "term1",
            terminalNode2: "term2",
            RGB: {
              red : 0,
              green : 10,
              blue : 255
            },
            AllowedVehicles: ["vehic1","vehic2"],
            AllowedDrivers: []};

        let result: Line;
        await Line.create(dto).then(res => result = res);

        //Assertions
        expect(result).toBeInstanceOf(Line);

    });


    test('New line object should not be created with empty key  (failure case 1)', async () => {
        
        let dto = {
            key: "",
            name: "name1",
            terminalNode1: "term1",
            terminalNode2: "term2",
            RGB: {
              red : 0,
              green : 10,
              blue : 255
            },
            AllowedVehicles: ["vehic1","vehic2"],
            AllowedDrivers: []};

        let result;
        await Line.create(dto).catch(res => result = res);

        //Assertions
        expect(result).toBeInstanceOf(Error);

    });

    test('New line object should not be created with empty name (failure case 2)', async () => {
        
        let dto = {
            key: "line1",
            name: "",
            terminalNode1: "term1",
            terminalNode2: "term2",
            RGB: {
              red : 0,
              green : 10,
              blue : 255
            },
            AllowedVehicles: ["vehic1","vehic2"],
            AllowedDrivers: []};

        let result;
        await Line.create(dto).catch(res => result = res);

        //Assertions
        expect(result).toBeInstanceOf(Error);

    });

    test('New line object should not be created with empty terminal Node (failure case 3)', async () => {
        
        let dto = {
            key: "line1",
            name: "name1",
            terminalNode1: "",
            terminalNode2: "term2",
            RGB: {
              red : 0,
              green : 10,
              blue : 255
            },
            AllowedVehicles: ["vehic1","vehic2"],
            AllowedDrivers: []};

        let result;
        await Line.create(dto).catch(res => result = res);

        //Assertions
        expect(result).toBeInstanceOf(Error);

    });

    test('New line object should not be created with RGB over 255 (failure case 4)', async () => {
        
        let dto = {
            key: "line1",
            name: "name1",
            terminalNode1: "term1",
            terminalNode2: "term2",
            RGB: {
              red : 0,
              green : 10,
              blue : 256
            },
            AllowedVehicles: ["vehic1","vehic2"],
            AllowedDrivers: []};

        let result;
        await Line.create(dto).catch(res => result = res);

        //Assertions
        expect(result).toBeInstanceOf(Error);

    });

    test('New line object should not be created with RGB under 0 (failure case 5)', async () => {
        
        let dto = {
            key: "line1",
            name: "name1",
            terminalNode1: "term1",
            terminalNode2: "term2",
            RGB: {
              red : -1,
              green : 10,
              blue : 255
            },
            AllowedVehicles: ["vehic1","vehic2"],
            AllowedDrivers: []};

        let result;
        await Line.create(dto).catch(res => result = res);

        //Assertions
        expect(result).toBeInstanceOf(Error);

    });

    test('New line object should not be created with empty element inside allowed vehicles (failure case 6)', async () => {
        
        let dto = {
            key: "line1",
            name: "name1",
            terminalNode1: "term1",
            terminalNode2: "term2",
            RGB: {
              red : -1,
              green : 10,
              blue : 255
            },
            AllowedVehicles: ["","vehic2"],
            AllowedDrivers: []};

        let result;
        await Line.create(dto).catch(res => result = res);

        //Assertions
        expect(result).toBeInstanceOf(Error);

    });

    test('New line object should not be created with empty element inside allowed drivers (failure case 7)', async () => {
        
        let dto = {
            key: "line1",
            name: "name1",
            terminalNode1: "term1",
            terminalNode2: "term2",
            RGB: {
              red : -1,
              green : 10,
              blue : 255
            },
            AllowedVehicles: [],
            AllowedDrivers: ["","driv1"]};

        let result;
        await Line.create(dto).catch(res => result = res);

        //Assertions
        expect(result).toBeInstanceOf(Error);

    });

});