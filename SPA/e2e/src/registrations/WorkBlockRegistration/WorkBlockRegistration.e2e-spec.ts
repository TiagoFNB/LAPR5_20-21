import { browser, by, element } from 'protractor';

describe('Register workblocks E2E tests', function() {

    beforeAll(async () => {
        await browser.get('http://localhost:4200/');
        await browser.waitForAngularEnabled(true);
        await browser.sleep(1000);
        let logedUser = {
            email: 'rogernio@gmail.com',
            role: 'admin',
            token:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlJvZ2VyaW8iLCJEYXRlT2ZCaXJ0aCI6IjcvMjEvMTk5MyIsImV4cCI6MTYxMzMzOTIwMiwiaXNzIjoicm9nZXIuY29tIiwiYXVkIjoicm9nZXIuY29tIn0.lHxpKItoPZNPjWonKBE6I_gEJ2kb3Zvn6X8U0gh849U'
        };
        await browser.executeScript('window.localStorage.clear()');
        await browser.executeScript(
            `window.localStorage.setItem('currentUser', '{"email":"rogernio@gmail.com","role":"Admin","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlJvZ2VyaW8iLCJEYXRlT2ZCaXJ0aCI6IjcvMjEvMTk5MyIsImV4cCI6MTYxMzYwMDQxOCwiaXNzIjoicm9nZXIuY29tIiwiYXVkIjoicm9nZXIuY29tIn0.AtKnp80t6KfwxSSBLBmUofr4mjRMWNH0tJGRzQBpyWM"}');`
        );
        //window.localStorage.setItem('currentUser', JSON.stringify(logedUser));
        let x = await browser.executeScript('window.localStorage.getItem("currentUser")');

        await browser.sleep(2000);

        // //Creates the first node
        await browser.get('http://localhost:4200/registrations/node');
        await browser.waitForAngularEnabled(true);

        element(by.name('name')).sendKeys('WorkBlockNodeName1');
        element(by.name('shortName')).sendKeys('WorkBlockNodeShortName1');
        element(by.name('Latitude')).sendKeys(0);
        element(by.name('Longitude')).sendKeys(0);
        element(by.name('depot')).click();
        element(by.name('Relief')).sendKeys('true');
        element(by.name('Duration')).sendKeys(10);
        await browser.sleep(500);
        element(by.name('form')).submit();

        await browser.sleep(500);

        //Creates the second node
        await browser.get('http://localhost:4200/registrations/node');
        await browser.waitForAngularEnabled(true);

        element(by.name('name')).sendKeys('WorkBlockNodeName2');
        element(by.name('shortName')).sendKeys('WorkBlockNodeShortName2');
        element(by.name('Latitude')).sendKeys(1);
        element(by.name('Longitude')).sendKeys(1);
        element(by.name('depot')).click();
        element(by.name('Relief')).sendKeys('true');
        element(by.name('Duration')).sendKeys(10);
        await browser.sleep(500);
        element(by.name('form')).submit();

        await browser.sleep(500);

        //Creates the line
        await browser.get('http://localhost:4200/registrations/line-registration');
        await browser.waitForAngularEnabled(true);

        element(by.name('code')).sendKeys('WorkBlockLineCode');
        element(by.name('Name')).sendKeys('WorkBlockLineName');
        element(by.name('terminalNode1')).sendKeys('WorkBlockNodeName1');
        element(by.name('terminalNode2')).sendKeys('WorkBlockNodeName2');

        await browser.sleep(500);
        element(by.name('form')).submit();

        await browser.sleep(2000);

        //Creates the path
        await browser.get('http://localhost:4200/registrations/path');
        await browser.waitForAngularEnabled(true);

        element(by.name('key')).sendKeys('WorkBlockPathKey');
        element(by.name('line')).sendKeys('WorkBlockLineName');
        element(by.name('type')).sendKeys('Go');

        element(by.name('node1')).sendKeys('WorkBlockNodeShortName1');
        element(by.name('node2')).sendKeys('WorkBlockNodeShortName2');
        element(by.name('duration')).sendKeys(3600);
        element(by.name('distance')).sendKeys(100);
        await browser.sleep(1000);
        element(by.name('Define')).click();
        await browser.sleep(1000);
        element(by.name('form')).submit();
        await browser.sleep(1000);
        
        
        //Creates the trip
        await browser.get('http://localhost:4200/registrations/trip');
        await browser.waitForAngularEnabled(true);
        element(by.name('selectedType')).sendKeys('Ad Hoc');
        await browser.sleep(500);
        element(by.name('line')).sendKeys('WorkBlockLineName');	
        await browser.sleep(500);	
        element(by.name('path')).sendKeys('WorkBlockPathKey');
        element(by.name('startingTime')).sendKeys('08:00');

        await browser.sleep(1000);

        element(by.id('btnid')).click();

        await browser.sleep(1000);
        
        //Creates the vehicle type
        await browser.get('http://localhost:4200/registrations/vehicleType');
        await browser.waitForAngularEnabled(true);

        element(by.name('name')).sendKeys('WbVtTest');
        element(by.name('fuelType')).sendKeys('gpl');
        element(by.name('CostPerKm')).sendKeys(10);
        element(by.name('Currency')).sendKeys('EUR');
        element(by.name('AverageConsumption')).sendKeys(30);
        element(by.name('Autonomy')).sendKeys(29);
        element(by.name('AverageSpeed')).sendKeys(10);
        element(by.name('description')).sendKeys('desc1');

        await browser.sleep(200);

        element(by.name('form')).submit();

        await browser.sleep(2000);
        
        //Creates the vehicle
        await browser.get('http://localhost:4200/registrations/vehicle');
        await browser.waitForAngularEnabled(true);

        element(by.name('vehicleLicense')).sendKeys('WB-00-TT');
        element(by.name('vehicleVin')).sendKeys('00000000000003101');
        element(by.name('type')).sendKeys('WbVtTest');
        element(by.name('DatePicker')).sendKeys('01/01/2015');
            

        await browser.sleep(200);

        element(by.name('form')).submit();
        
        await browser.sleep(1000);

        //Creates a vehicle duty
        await browser.get('http://localhost:4200/registrations/vehicleDuty');
        await browser.waitForAngularEnabled(true);

        element(by.name('vehicleDutyCode')).sendKeys('VeicDutWB1');
        element(by.name('license')).sendKeys('WB-00-TT');
            
        await browser.sleep(200);

        element(by.name('form')).submit();

        await browser.sleep(1000);
    });

    it('WorkBlock submitted successfully ', async function() {
		await browser.get('http://localhost:4200/registrations/workblock');
		await browser.waitForAngularEnabled(true);

        //Note: the trip begins at 8:00h and ends at 9:00h

        //Define the variables
        let vehicleDuty : string = 'VeicDutWB1';
        let amountBlocks : string = '2';
        let durationBlocks : string = '01:00';
        let time : string = '2030-01-20T07:30';
        let line : string = 'WorkBlockLineCode';

        //Fill in the fields
		element(by.name('VehicleDutyId')).sendKeys(vehicleDuty);
        element(by.name('AmountBlocks')).sendKeys(amountBlocks);
        element(by.name('DurationBlocks')).sendKeys(durationBlocks);

        //Fill the time field (this is awfull to do, but it's the best I could find)
        element(by.name('Time')).sendKeys('01');    //Month
        element(by.name('Time')).sendKeys('20');    //Day
        element(by.name('Time')).sendKeys('002030');    //Year (yes, the 0s as prefix are required)
        element(by.name('Time')).sendKeys('07');    //hour
        element(by.name('Time')).sendKeys('30');    //minute
        element(by.name('Time')).sendKeys('1');     //1 - AM, 2 - PM

        element(by.name('Line')).sendKeys(line);

        element(by.name('SearchTripsButton')).click();

        await browser.sleep(2000);

        //Add the trips to the list (the add button name is in this format: pathName-departureTime)
        element(by.name('WorkBlockPathKey-08:00h')).click();

		element(by.name('form')).submit();

        await browser.sleep(3000);

		expect(await element(by.name('successMessage')).isPresent()).toBe(true);
		expect(await element(by.name('successMessage')).getText()).toEqual('Created 2 workblocks successfully.');
    });
    
    it('WorkBlock submitted error -> No vehicledutyID ', async function() {
		await browser.get('http://localhost:4200/registrations/workblock');
		await browser.waitForAngularEnabled(true);

        //Note: the trip begins at 8:00h and ends at 9:00h

        //Define the variables
        let vehicleDuty : string = 'VeicDutWB1';
        let amountBlocks : string = '2';
        let durationBlocks : string = '01:00';
        let time : string = '2030-01-20T07:30';
        let line : string = 'WorkBlockLineCode';

        //Fill in the fields
        element(by.name('AmountBlocks')).sendKeys(amountBlocks);
        element(by.name('DurationBlocks')).sendKeys(durationBlocks);

        //Fill the time field (this is awfull to do, but it's the best I could find)
        element(by.name('Time')).sendKeys('01');    //Month
        element(by.name('Time')).sendKeys('20');    //Day
        element(by.name('Time')).sendKeys('002030');    //Year (yes, the 0s as prefix are required)
        element(by.name('Time')).sendKeys('07');    //hour
        element(by.name('Time')).sendKeys('30');    //minute
        element(by.name('Time')).sendKeys('1');     //1 - AM, 2 - PM

        element(by.name('Line')).sendKeys(line);

        element(by.name('SearchTripsButton')).click();

        await browser.sleep(2000);

        //Add the trips to the list (the add button name is in this format: pathName-departureTime)
        element(by.name('WorkBlockPathKey-08:00h')).click();

		element(by.name('form')).submit();

        await browser.sleep(3000);

		//Form was not submitted since no message has been received
		try {
			expect(await element(by.name('successMessage'))).toBeDefined();
			fail;
		} catch (err) {
			try {
				expect(await element(by.name('errorMessage'))).toBeDefined();
				fail;
			} catch (err) {}
		}
    });
    
    it('WorkBlock submitted error -> No amount of blocks ', async function() {
		await browser.get('http://localhost:4200/registrations/workblock');
		await browser.waitForAngularEnabled(true);

        //Note: the trip begins at 8:00h and ends at 9:00h

        //Define the variables
        let vehicleDuty : string = 'VeicDutWB1';
        let amountBlocks : string = '2';
        let durationBlocks : string = '01:00';
        let time : string = '2030-01-20T07:30';
        let line : string = 'WorkBlockLineCode';

        //Fill in the fields
        element(by.name('VehicleDutyId')).sendKeys(vehicleDuty);
        element(by.name('DurationBlocks')).sendKeys(durationBlocks);


        //Fill the time field (this is awfull to do, but it's the best I could find)
        element(by.name('Time')).sendKeys('01');    //Month
        element(by.name('Time')).sendKeys('20');    //Day
        element(by.name('Time')).sendKeys('002030');    //Year (yes, the 0s as prefix are required)
        element(by.name('Time')).sendKeys('07');    //hour
        element(by.name('Time')).sendKeys('30');    //minute
        element(by.name('Time')).sendKeys('1');     //1 - AM, 2 - PM

        element(by.name('Line')).sendKeys(line);

        element(by.name('SearchTripsButton')).click();

        await browser.sleep(2000);

        //Add the trips to the list (the add button name is in this format: pathName-departureTime)
        element(by.name('WorkBlockPathKey-08:00h')).click();

		element(by.name('form')).submit();

        await browser.sleep(3000);

		//Form was not submitted since no message has been received
		try {
			expect(await element(by.name('successMessage'))).toBeDefined();
			fail;
		} catch (err) {
			try {
				expect(await element(by.name('errorMessage'))).toBeDefined();
				fail;
			} catch (err) {}
		}
    });
    
    it('WorkBlock submitted error -> No starting time ', async function() {
		await browser.get('http://localhost:4200/registrations/workblock');
		await browser.waitForAngularEnabled(true);

        //Note: the trip begins at 8:00h and ends at 9:00h

        //Define the variables
        let vehicleDuty : string = 'VeicDutWB1';
        let amountBlocks : string = '2';
        let durationBlocks : string = '01:00';
        let time : string = '2030-01-20T07:30';
        let line : string = 'WorkBlockLineCode';

        //Fill in the fields
        element(by.name('VehicleDutyId')).sendKeys(vehicleDuty);
        element(by.name('AmountBlocks')).sendKeys(amountBlocks);
        element(by.name('DurationBlocks')).sendKeys(durationBlocks);


        element(by.name('Line')).sendKeys(line);

        element(by.name('SearchTripsButton')).click();

        await browser.sleep(2000);

        //Add the trips to the list (the add button name is in this format: pathName-departureTime)
        element(by.name('WorkBlockPathKey-08:00h')).click();

		element(by.name('form')).submit();

        await browser.sleep(3000);

		//Form was not submitted since no message has been received
		try {
			expect(await element(by.name('successMessage'))).toBeDefined();
			fail;
		} catch (err) {
			try {
				expect(await element(by.name('errorMessage'))).toBeDefined();
				fail;
			} catch (err) {}
		}
    });
    
    it('WorkBlock submitted error -> No block duration ', async function() {
		await browser.get('http://localhost:4200/registrations/workblock');
		await browser.waitForAngularEnabled(true);

        //Note: the trip begins at 8:00h and ends at 9:00h

        //Define the variables
        let vehicleDuty : string = 'VeicDutWB1';
        let amountBlocks : string = '2';
        let durationBlocks : string = '01:00';
        let time : string = '2030-01-20T07:30';
        let line : string = 'WorkBlockLineCode';

        //Fill in the fields
        element(by.name('VehicleDutyId')).sendKeys(vehicleDuty);
        element(by.name('AmountBlocks')).sendKeys(amountBlocks);

        //Fill the time field (this is awfull to do, but it's the best I could find)
        element(by.name('Time')).sendKeys('01');    //Month
        element(by.name('Time')).sendKeys('20');    //Day
        element(by.name('Time')).sendKeys('002030');    //Year (yes, the 0s as prefix are required)
        element(by.name('Time')).sendKeys('07');    //hour
        element(by.name('Time')).sendKeys('30');    //minute
        element(by.name('Time')).sendKeys('1');     //1 - AM, 2 - PM


        element(by.name('Line')).sendKeys(line);

        element(by.name('SearchTripsButton')).click();

        await browser.sleep(2000);

        //Add the trips to the list (the add button name is in this format: pathName-departureTime)
        element(by.name('WorkBlockPathKey-08:00h')).click();

		element(by.name('form')).submit();

        await browser.sleep(3000);

		//Form was not submitted since no message has been received
		try {
			expect(await element(by.name('successMessage'))).toBeDefined();
			fail;
		} catch (err) {
			try {
				expect(await element(by.name('errorMessage'))).toBeDefined();
				fail;
			} catch (err) {}
		}
    });
    
    it('WorkBlock submitted error -> No trips added ', async function() {
		await browser.get('http://localhost:4200/registrations/workblock');
		await browser.waitForAngularEnabled(true);

        //Note: the trip begins at 8:00h and ends at 9:00h

        //Define the variables
        let vehicleDuty : string = 'VeicDutWB1';
        let amountBlocks : string = '2';
        let durationBlocks : string = '01:00';
        let time : string = '2030-01-20T07:30';
        let line : string = 'WorkBlockLineCode';

        //Fill in the fields
        element(by.name('VehicleDutyId')).sendKeys(vehicleDuty);
        element(by.name('AmountBlocks')).sendKeys(amountBlocks);
        element(by.name('DurationBlocks')).sendKeys(durationBlocks);

        //Fill the time field (this is awfull to do, but it's the best I could find)
        element(by.name('Time')).sendKeys('01');    //Month
        element(by.name('Time')).sendKeys('20');    //Day
        element(by.name('Time')).sendKeys('002030');    //Year (yes, the 0s as prefix are required)
        element(by.name('Time')).sendKeys('07');    //hour
        element(by.name('Time')).sendKeys('30');    //minute
        element(by.name('Time')).sendKeys('1');     //1 - AM, 2 - PM

		element(by.name('form')).submit();

        await browser.sleep(3000);

		//Form was not submitted since no message has been received
		try {
			expect(await element(by.name('successMessage'))).toBeDefined();
			fail;
		} catch (err) {
			try {
				expect(await element(by.name('errorMessage'))).toBeDefined();
				fail;
			} catch (err) {}
		}
	});
});