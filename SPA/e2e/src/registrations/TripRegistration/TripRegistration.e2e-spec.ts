import { browser, by, element } from 'protractor';

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

	//Creates a single node
	await browser.get('http://localhost:4200/registrations/node');
	await browser.waitForAngularEnabled(true);

	element(by.name('name')).sendKeys('shortnameTrip1');
	element(by.name('shortName')).sendKeys('shortnameTrip1');
	element(by.name('Latitude')).sendKeys(12);
	element(by.name('Longitude')).sendKeys(22);
	element(by.name('depot')).click();
	element(by.name('Relief')).sendKeys('true');
	element(by.name('Duration')).sendKeys(10);
	await browser.sleep(500);
	element(by.name('form')).submit();

	await browser.sleep(500);

	await browser.get('http://localhost:4200/registrations/node');
	await browser.waitForAngularEnabled(true);

	element(by.name('name')).sendKeys('shortnameTrip2');
	element(by.name('shortName')).sendKeys('shortnameTrip2');
	element(by.name('Latitude')).sendKeys(11);
	element(by.name('Longitude')).sendKeys(21);
	element(by.name('depot')).click();
	element(by.name('Relief')).sendKeys('true');
	element(by.name('Duration')).sendKeys(10);
	await browser.sleep(500);
	element(by.name('form')).submit();

	await browser.sleep(500);

	await browser.get('http://localhost:4200/registrations/line-registration');
	await browser.waitForAngularEnabled(true);

	element(by.name('code')).sendKeys('105');
	element(by.name('Name')).sendKeys('lineTestForTrip');
	element(by.name('terminalNode1')).sendKeys('shortnameTrip1');
	element(by.name('terminalNode2')).sendKeys('shortnameTrip2');

	await browser.sleep(5000);
	element(by.name('form')).submit();

	await browser.sleep(1000);

	await browser.get('http://localhost:4200/registrations/path');
	await browser.waitForAngularEnabled(true);

	element(by.name('key')).sendKeys('pathTestTrip');
	element(by.name('line')).sendKeys('lineTestForTrip');
	element(by.name('type')).sendKeys('Go');

	element(by.name('node1')).sendKeys('shortnameTrip1');
	element(by.name('node2')).sendKeys('shortnameTrip2');
	element(by.name('duration')).sendKeys(5);
	element(by.name('distance')).sendKeys(10);
	await browser.sleep(1000);
	element(by.name('Define')).click();
	await browser.sleep(1000);
	element(by.name('form')).submit();
	await browser.sleep(1000);
});

describe('Trip Registration', function() {
	it('should submit with sucess ', async function() {
		await browser.get('http://localhost:4200/registrations/trip');
		await browser.waitForAngularEnabled(true);
		element(by.name('selectedType')).sendKeys('Ad Hoc');
		await browser.sleep(500);
		element(by.name('line')).sendKeys('lineTestForTrip');	
		await browser.sleep(500);	
		element(by.name('path')).sendKeys('pathTestTrip');
		element(by.name('startingTime')).sendKeys('00:30');


		await browser.sleep(1000);

		element(by.id('btnid')).click();

		await browser.sleep(1000);

		expect(await element(by.name('SuccessMessage')).getText()).toEqual('Trip created sucessfully');
	});

	it('should submit with sucess 2', async function() {
		await browser.get('http://localhost:4200/registrations/trip');
		await browser.waitForAngularEnabled(true);
		element(by.name('selectedType')).sendKeys('Multiple trips');
		await browser.sleep(500);
		element(by.name('line')).sendKeys('lineTestForTrip');
		await browser.sleep(500);		
		element(by.name('path')).sendKeys('pathTestTrip');
		element(by.name('startingTime')).sendKeys('00:30');
		element(by.name('endingTime')).sendKeys('00:40');
		element(by.name('frequency')).sendKeys('00:03');


		await browser.sleep(1000);

		element(by.id('btnid')).click();

		await browser.sleep(1000);

		expect(await element(by.name('SuccessMessage')).getText()).toEqual('Trips created sucessfully');
	});

	it('should submit with success even tho frequency doesnt have values, creates ad hoc', async function() {
		await browser.get('http://localhost:4200/registrations/trip');
		await browser.waitForAngularEnabled(true);
		element(by.name('selectedType')).sendKeys('Multiple trips');
		await browser.sleep(500);
		element(by.name('line')).sendKeys('lineTestForTrip');
		await browser.sleep(500);		
		element(by.name('path')).sendKeys('pathTestTrip');
		element(by.name('startingTime')).sendKeys('00:30');
		element(by.name('endingTime')).sendKeys('00:40');


		await browser.sleep(1000);

		element(by.id('btnid')).click();

		await browser.sleep(1000);

		expect(await element(by.name('SuccessMessage')).getText()).toEqual('Trip created sucessfully');
	});
	
	it('should submit with success even tho ending time doesnt have values, creates ad hoc', async function() {
		await browser.get('http://localhost:4200/registrations/trip');
		await browser.waitForAngularEnabled(true);
		element(by.name('selectedType')).sendKeys('Multiple trips');
		await browser.sleep(500);
		element(by.name('line')).sendKeys('lineTestForTrip');	
		await browser.sleep(500);	
		element(by.name('path')).sendKeys('pathTestTrip');
		element(by.name('startingTime')).sendKeys('00:30');
		element(by.name('frequency')).sendKeys('00:03');

		await browser.sleep(1000);

		element(by.id('btnid')).click();

		await browser.sleep(1000);

		expect(await element(by.name('SuccessMessage')).getText()).toEqual('Trip created sucessfully');
	});
	it('should not submit with sucess line missing', async function() {
		await browser.get('http://localhost:4200/registrations/trip');
		await browser.waitForAngularEnabled(true);

		element(by.name('selectedType')).sendKeys('Ad Hoc');
		await browser.sleep(500);
		element(by.name('path')).sendKeys('pathTestTrip');
		element(by.name('startingTime')).sendKeys('00:30');

		await browser.sleep(1000);

		element(by.id('btnid')).click();

		await browser.sleep(1000);

		expect(await element(by.name('ErrorMessage')).getText()).toEqual('LineId Must be defined');
	});

	it('should not submit with sucess path missing', async function() {
		await browser.get('http://localhost:4200/registrations/trip');
		await browser.waitForAngularEnabled(true);
		element(by.name('selectedType')).sendKeys('Ad Hoc');
		await browser.sleep(500);
		element(by.name('line')).sendKeys('lineTestForTrip');	
		element(by.name('startingTime')).sendKeys('00:30');


		await browser.sleep(1000);

		element(by.id('btnid')).click();

		await browser.sleep(1000);

		expect(await element(by.name('ErrorMessage')).getText()).toEqual('PathId Must be defined');
	});
	
	it('should not submit with sucess starting time missing', async function() {
		await browser.get('http://localhost:4200/registrations/trip');
		await browser.waitForAngularEnabled(true);
		element(by.name('selectedType')).sendKeys('Multiple trips');
		await browser.sleep(500);
		element(by.name('line')).sendKeys('lineTestForTrip');	
		await browser.sleep(500);
		element(by.name('path')).sendKeys('pathTestTrip');
		element(by.name('endingTime')).sendKeys('00:40');
		element(by.name('frequency')).sendKeys('00:03');

		await browser.sleep(1000);

		element(by.id('btnid')).click();

		await browser.sleep(1000);

		expect(await element(by.name('ErrorMessage')).getText()).toEqual('Starting time must be defined');
	});

	it('should not submit because ending time is lower than starting', async function() {
		await browser.get('http://localhost:4200/registrations/trip');
		await browser.waitForAngularEnabled(true);
		element(by.name('selectedType')).sendKeys('Multiple trips');
		await browser.sleep(500);
		element(by.name('line')).sendKeys('lineTestForTrip');
		await browser.sleep(500);	
		element(by.name('path')).sendKeys('pathTestTrip');
		element(by.name('startingTime')).sendKeys('00:50');
		element(by.name('endingTime')).sendKeys('00:40');
		element(by.name('frequency')).sendKeys('00:03');

		await browser.sleep(1000);

		element(by.id('btnid')).click();

		await browser.sleep(1000);

		expect(await element(by.name('ErrorMessage')).getText()).toEqual('End time cant be lower than starting time');
	});
});
