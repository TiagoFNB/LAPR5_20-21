import { browser, by, element } from 'protractor';

describe('Register create vehicle type  E2E tests with all possible fields , currency as EUR and fuelType as gpl', function() {
	beforeAll(async () => {
		await browser.get('http://localhost:4200/');
		await browser.waitForAngularEnabled(true);
		await browser.sleep(1000);

		await browser.executeScript('window.localStorage.clear()');
		await browser.executeScript(
			`window.localStorage.setItem('currentUser', '{"email":"rogernio@gmail.com","role":"Admin","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlJvZ2VyaW8iLCJEYXRlT2ZCaXJ0aCI6IjcvMjEvMTk5MyIsImV4cCI6MTYxMzYwMDQxOCwiaXNzIjoicm9nZXIuY29tIiwiYXVkIjoicm9nZXIuY29tIn0.AtKnp80t6KfwxSSBLBmUofr4mjRMWNH0tJGRzQBpyWM"}');`
		);
		//window.localStorage.setItem('currentUser', JSON.stringify(logedUser));
		let x = await browser.executeScript('window.localStorage.getItem("currentUser")');

		await browser.sleep(2000);
	});

	it('should vehicle type submit with sucess ', async function() {
		await browser.get('http://localhost:4200/registrations/vehicleType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('supername');
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

		//await browser.sleep(20000);
		expect(await element(by.name('SuccessMessage')).isDisplayed()).toBe(true);
		expect(await element(by.name('SuccessMessage')).getText()).toEqual('Vehicle Type Created Sucessfully');

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('should create vehicle type  with sucess currency as USD and fuelType as diesel', async function() {
		await browser.get('http://localhost:4200/registrations/vehicleType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('supername2');
		element(by.name('fuelType')).sendKeys('diesel');
		element(by.name('CostPerKm')).sendKeys(10);
		element(by.name('Currency')).sendKeys('USD');
		element(by.name('AverageConsumption')).sendKeys(30);
		element(by.name('Autonomy')).sendKeys(29);
		element(by.name('AverageSpeed')).sendKeys(10);
		element(by.name('description')).sendKeys('desc1');

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(2000);

		//await browser.sleep(20000);
		expect(await element(by.name('SuccessMessage')).isDisplayed()).toBe(true);
		expect(await element(by.name('SuccessMessage')).getText()).toEqual('Vehicle Type Created Sucessfully');

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('should create vehicle type  with sucess currency as GBP and fuelType as hydrogen', async function() {
		await browser.get('http://localhost:4200/registrations/vehicleType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('supername3');
		element(by.name('fuelType')).sendKeys('hydrogen');
		element(by.name('CostPerKm')).sendKeys(10);
		element(by.name('Currency')).sendKeys('GBP');
		element(by.name('AverageConsumption')).sendKeys(30);
		element(by.name('Autonomy')).sendKeys(29);
		element(by.name('AverageSpeed')).sendKeys(10);
		element(by.name('description')).sendKeys('desc1');

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(2000);

		//await browser.sleep(20000);
		expect(await element(by.name('SuccessMessage')).isDisplayed()).toBe(true);
		expect(await element(by.name('SuccessMessage')).getText()).toEqual('Vehicle Type Created Sucessfully');

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('should create vehicle type  with sucess currency as BRL and fuelType as electric and without description', async function() {
		await browser.get('http://localhost:4200/registrations/vehicleType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('supername4');
		element(by.name('fuelType')).sendKeys('electric');
		element(by.name('CostPerKm')).sendKeys(10);
		element(by.name('Currency')).sendKeys('BRL');
		element(by.name('AverageConsumption')).sendKeys(30);
		element(by.name('Autonomy')).sendKeys(29);
		element(by.name('AverageSpeed')).sendKeys(10);

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(2000);

		//await browser.sleep(20000);
		expect(await element(by.name('SuccessMessage')).isDisplayed()).toBe(true);
		expect(await element(by.name('SuccessMessage')).getText()).toEqual('Vehicle Type Created Sucessfully');

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('should create vehicle type  with sucess currency undefined (will default to EUR) and fuelType as gasoline ', async function() {
		await browser.get('http://localhost:4200/registrations/vehicleType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('supername5');
		element(by.name('fuelType')).sendKeys('gasoline');
		element(by.name('CostPerKm')).sendKeys(10);
		element(by.name('Currency')).sendKeys('BRL');
		element(by.name('AverageConsumption')).sendKeys(30);
		element(by.name('Autonomy')).sendKeys(29);
		element(by.name('AverageSpeed')).sendKeys(10);

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(2000);

		//await browser.sleep(20000);
		expect(await element(by.name('SuccessMessage')).isDisplayed()).toBe(true);
		expect(await element(by.name('SuccessMessage')).getText()).toEqual('Vehicle Type Created Sucessfully');

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('should Not vehicle type becouse of duplicate key ', async function() {
		await browser.get('http://localhost:4200/registrations/vehicleType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('supername5');
		element(by.name('fuelType')).sendKeys('gasoline');
		element(by.name('CostPerKm')).sendKeys(10);
		element(by.name('Currency')).sendKeys('BRL');
		element(by.name('AverageConsumption')).sendKeys(30);
		element(by.name('Autonomy')).sendKeys(29);
		element(by.name('AverageSpeed')).sendKeys(10);

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(2000);

		//await browser.sleep(20000);
		expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual(
			'Error: That vehicle type already exists in the system'
		);

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('should Not vehicle type becouse of invalid currency ', async function() {
		await browser.get('http://localhost:4200/registrations/vehicleType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('supername5');
		element(by.name('fuelType')).sendKeys('gasoline');
		element(by.name('CostPerKm')).sendKeys(10);
		element(by.name('Currency')).sendKeys('XPTO');
		element(by.name('AverageConsumption')).sendKeys(30);
		element(by.name('Autonomy')).sendKeys(29);
		element(by.name('AverageSpeed')).sendKeys(10);

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(2000);

		//await browser.sleep(20000);
		expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('should Not vehicle type becouse of invalid fuelType ', async function() {
		await browser.get('http://localhost:4200/registrations/vehicleType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('supername5');
		element(by.name('fuelType')).sendKeys('invalidFuelType');
		element(by.name('CostPerKm')).sendKeys(10);
		element(by.name('Currency')).sendKeys('EUR');
		element(by.name('AverageConsumption')).sendKeys(30);
		element(by.name('Autonomy')).sendKeys(29);
		element(by.name('AverageSpeed')).sendKeys(10);

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(2000);

		//await browser.sleep(20000);
		expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('should Not vehicle type becouse of invalid name ', async function() {
		await browser.get('http://localhost:4200/registrations/vehicleType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('n');
		element(by.name('fuelType')).sendKeys('invalidFuelType');
		element(by.name('CostPerKm')).sendKeys(10);
		element(by.name('Currency')).sendKeys('EUR');
		element(by.name('AverageConsumption')).sendKeys(30);
		element(by.name('Autonomy')).sendKeys(29);
		element(by.name('AverageSpeed')).sendKeys(10);

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(2000);

		//await browser.sleep(20000);
		expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('should Not vehicle type becouse of invalid CostPerKm ', async function() {
		await browser.get('http://localhost:4200/registrations/vehicleType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('nnn');
		element(by.name('fuelType')).sendKeys('invalidFuelType');
		element(by.name('CostPerKm')).sendKeys(0.001);
		element(by.name('Currency')).sendKeys('EUR');
		element(by.name('AverageConsumption')).sendKeys(30);
		element(by.name('Autonomy')).sendKeys(29);
		element(by.name('AverageSpeed')).sendKeys(10);

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(2000);

		//await browser.sleep(20000);
		expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('should Not vehicle type becouse of invalid AverageConsumption ', async function() {
		await browser.get('http://localhost:4200/registrations/vehicleType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('nnn');
		element(by.name('fuelType')).sendKeys('invalidFuelType');
		element(by.name('CostPerKm')).sendKeys(3);
		element(by.name('Currency')).sendKeys('EUR');
		element(by.name('AverageConsumption')).sendKeys(0.0003);
		element(by.name('Autonomy')).sendKeys(29);
		element(by.name('AverageSpeed')).sendKeys(10);

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(2000);

		//await browser.sleep(20000);
		expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('should Not vehicle type becouse of invalid Autonomy ', async function() {
		await browser.get('http://localhost:4200/registrations/vehicleType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('nnn');
		element(by.name('fuelType')).sendKeys('invalidFuelType');
		element(by.name('CostPerKm')).sendKeys(3);
		element(by.name('Currency')).sendKeys('EUR');
		element(by.name('AverageConsumption')).sendKeys(4);
		element(by.name('Autonomy')).sendKeys(0.0001);
		element(by.name('AverageSpeed')).sendKeys(10);

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(2000);

		//await browser.sleep(20000);
		expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('should Not vehicle type becouse of invalid AverageSpeed ', async function() {
		await browser.get('http://localhost:4200/registrations/vehicleType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('nnn');
		element(by.name('fuelType')).sendKeys('invalidFuelType');
		element(by.name('CostPerKm')).sendKeys(3);
		element(by.name('Currency')).sendKeys('EUR');
		element(by.name('AverageConsumption')).sendKeys(4);
		element(by.name('Autonomy')).sendKeys(4);
		element(by.name('AverageSpeed')).sendKeys(0.0001);

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(2000);

		//await browser.sleep(20000);
		expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
	});
});
