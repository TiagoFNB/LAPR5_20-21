import { browser, by, element } from 'protractor';


describe('Register vehicle duty  E2E tests with all possible fields', function() {
    
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

        //create a vehicle type (if it doesnt exist already)
        await browser.get('http://localhost:4200/registrations/vehicleType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('TESTE2E1');
		element(by.name('fuelType')).sendKeys('gpl');
		element(by.name('CostPerKm')).sendKeys(10);
		element(by.name('Currency')).sendKeys('EUR');
		element(by.name('AverageConsumption')).sendKeys(30);
		element(by.name('Autonomy')).sendKeys(29);
		element(by.name('AverageSpeed')).sendKeys(10);
		element(by.name('description')).sendKeys('desc1');

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		
        await browser.sleep(2000);
        
        //create a vehicle
        await browser.get('http://localhost:4200/registrations/vehicle');
		await browser.waitForAngularEnabled(true);

		element(by.name('vehicleLicense')).sendKeys('EE-22-EE');
        element(by.name('vehicleVin')).sendKeys('99999999990000001');
        element(by.name('type')).sendKeys('TESTE2E1');
        element(by.name('DatePicker')).sendKeys('01/01/2015');
        

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		
		await browser.sleep(2000);
	});

	it('vehicle duty submit successful ', async function() {
		await browser.get('http://localhost:4200/registrations/vehicleDuty');
		await browser.waitForAngularEnabled(true);

		element(by.name('vehicleDutyCode')).sendKeys('E2E1111111');
        element(by.name('license')).sendKeys('EE-22-EE');
        

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(4000);

       
		//await browser.sleep(20000);
		expect(await element(by.name('SuccessMessage')).isDisplayed()).toBe(true);
		expect(await element(by.name('SuccessMessage')).getText()).toEqual('VehicleDuty was successfully registered.');

		
	});

	it('vehicle submit fail case 1, duplicated name ', async function() {
		await browser.get('http://localhost:4200/registrations/vehicleDuty');
		await browser.waitForAngularEnabled(true);

		element(by.name('vehicleDutyCode')).sendKeys('E2E1111111');
        element(by.name('license')).sendKeys('EE-22-EE');
        

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(4000);

        
		//await browser.sleep(20000);
		 expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
		// //await browser.sleep(20000);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual(
		 	'Error: That vehicle duty already exists in the system'
		 );

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('vehicle duty submit fail case 2, vehicle license is required ', async function() {

		await browser.get('http://localhost:4200/registrations/vehicleDuty');
		await browser.waitForAngularEnabled(true);

		element(by.name('vehicleDutyCode')).sendKeys('E2E1111111');
        
        

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(4000);

        
            expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
            expect(await element(by.name('ErrorMessage')).getText()).toEqual(
		 	'Vehicle is required'
		 );
	});

	it('vehicle submit fail case 3, code is required ', async function() {
		await browser.get('http://localhost:4200/registrations/vehicleDuty');
		await browser.waitForAngularEnabled(true);

		
        element(by.name('license')).sendKeys('EE-22-EE');
        

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(4000);

        expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
        expect(await element(by.name('ErrorMessage')).getText()).toEqual(
         'Code is required'
     );
    });
    
   
    it('vehicle submit fail case 4, invalid code ', async function() {
		await browser.get('http://localhost:4200/registrations/vehicleDuty');
		await browser.waitForAngularEnabled(true);

		element(by.name('vehicleDutyCode')).sendKeys('E2E');
        element(by.name('license')).sendKeys('EE-22-EE');
        

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(4000);
        
		//await browser.sleep(20000);
		 expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
		// //await browser.sleep(20000);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual(
		 	'Code must be 10 characters long'
		 );

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

});