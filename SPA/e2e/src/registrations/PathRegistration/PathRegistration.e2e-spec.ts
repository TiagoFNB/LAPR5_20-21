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

	element(by.name('name')).sendKeys('shortname1');
	element(by.name('shortName')).sendKeys('shortname1');
	element(by.name('Latitude')).sendKeys(10);
	element(by.name('Longitude')).sendKeys(20);
	element(by.name('depot')).click();
	element(by.name('Relief')).sendKeys('true');
	element(by.name('Duration')).sendKeys(10);
	await browser.sleep(500);
	element(by.name('form')).submit();

	await browser.sleep(500);

	await browser.get('http://localhost:4200/registrations/node');
	await browser.waitForAngularEnabled(true);

	element(by.name('name')).sendKeys('shortname2');
	element(by.name('shortName')).sendKeys('shortname2');
	element(by.name('Latitude')).sendKeys(10);
	element(by.name('Longitude')).sendKeys(20);
	element(by.name('depot')).click();
	element(by.name('Relief')).sendKeys('true');
	element(by.name('Duration')).sendKeys(10);
	await browser.sleep(500);
	element(by.name('form')).submit();

	await browser.sleep(500);

	await browser.get('http://localhost:4200/registrations/line-registration');
	await browser.waitForAngularEnabled(true);

	element(by.name('code')).sendKeys('100');
	element(by.name('Name')).sendKeys('lineTestForPath');
	element(by.name('terminalNode1')).sendKeys('shortname1');
	element(by.name('terminalNode2')).sendKeys('shortname2');

	await browser.sleep(5000);
	element(by.name('form')).submit();

	await browser.sleep(1000);
});

describe('Path Registration', function() {
	it('should submit with sucess ', async function() {
		await browser.get('http://localhost:4200/registrations/path');
		await browser.waitForAngularEnabled(true);

		element(by.name('key')).sendKeys('pathTest');
		element(by.name('line')).sendKeys('lineTestForPath');
		element(by.name('type')).sendKeys('Go');

		element(by.name('node1')).sendKeys('shortname1');
		element(by.name('node2')).sendKeys('shortname2');
		element(by.name('duration')).sendKeys(10);
		element(by.name('distance')).sendKeys(10);

		await browser.sleep(1000);
		element(by.name('Define')).click();

		await browser.sleep(1000);

		element(by.name('form')).submit();

		await browser.sleep(1000);

		expect(await element(by.name('SuccessMessage')).getText()).toEqual('Path Created Sucessfully');
	});

	it('should not submit with sucess because of duplicate identifier', async function() {
		await browser.get('http://localhost:4200/registrations/path');
		await browser.waitForAngularEnabled(true);

		element(by.name('key')).sendKeys('pathTest');
		element(by.name('line')).sendKeys('lineTestForPath');
		element(by.name('type')).sendKeys('Go');

		element(by.name('node1')).sendKeys('shortname1');
		element(by.name('node2')).sendKeys('shortname2');
		element(by.name('duration')).sendKeys(10);
		element(by.name('distance')).sendKeys(10);
		await browser.sleep(500);
		element(by.name('Define')).click();
		await browser.sleep(500);
		element(by.name('form')).submit();

		await browser.sleep(1000);
		await element(by.name('ErrorMessage')).getText();
		await browser.sleep(500);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual('Duplicated Path, key already in use :(');
	});

	it('should not submit with sucess because of identifier is missing', async function() {
		await browser.get('http://localhost:4200/registrations/path');
		await browser.waitForAngularEnabled(true);

		element(by.name('key')).sendKeys('');
		element(by.name('line')).sendKeys('lineTestForPath');
		element(by.name('type')).sendKeys('Go');

		element(by.name('node1')).sendKeys('shortname1');
		element(by.name('node2')).sendKeys('shortname2');
		element(by.name('duration')).sendKeys(10);
		element(by.name('distance')).sendKeys(10);
		await browser.sleep(500);
		element(by.name('Define')).click();
		await browser.sleep(500);
		element(by.name('form')).submit();

		await browser.sleep(1000);
		await element(by.name('ErrorMessage')).getText();
		await browser.sleep(500);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual('Identification is required');
	});

	it('should not submit with sucess because of line is missing', async function() {
		await browser.get('http://localhost:4200/registrations/path');
		await browser.waitForAngularEnabled(true);

		element(by.name('key')).sendKeys('pathTest2');
		element(by.name('line')).sendKeys('');
		element(by.name('type')).sendKeys('Go');

		element(by.name('node1')).sendKeys('shortname1');
		element(by.name('node2')).sendKeys('shortname2');
		element(by.name('duration')).sendKeys(10);
		element(by.name('distance')).sendKeys(10);
		await browser.sleep(500);
		element(by.name('Define')).click();
		await browser.sleep(500);
		element(by.name('form')).submit();

		await browser.sleep(1000);
		await element(by.name('ErrorMessage')).getText();
		await browser.sleep(500);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual('Line is required');
	});

	it('should not submit with sucess because of type is missing', async function() {
		await browser.get('http://localhost:4200/registrations/path');
		await browser.waitForAngularEnabled(true);

		element(by.name('key')).sendKeys('pathTest2');
		element(by.name('line')).sendKeys('lineTestForPath');
		element(by.name('type')).sendKeys('');

		element(by.name('node1')).sendKeys('shortname1');
		element(by.name('node2')).sendKeys('shortname2');
		element(by.name('duration')).sendKeys(10);
		element(by.name('distance')).sendKeys(10);
		await browser.sleep(500);
		element(by.name('Define')).click();
		await browser.sleep(500);
		element(by.name('form')).submit();

		await browser.sleep(1000);
		await element(by.name('ErrorMessage')).getText();
		await browser.sleep(500);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual('Path type is required');
	});

	it('should not submit with sucess because of missing segments', async function() {
		await browser.get('http://localhost:4200/registrations/path');
		await browser.waitForAngularEnabled(true);

		element(by.name('key')).sendKeys('pathTest2');
		element(by.name('line')).sendKeys('lineTestForPath');
		element(by.name('type')).sendKeys('Go');

		element(by.name('node1')).sendKeys('shortname1');
		element(by.name('node2')).sendKeys('shortname2');
		element(by.name('duration')).sendKeys(10);
		element(by.name('distance')).sendKeys(10);

		//didnt define pathsegment so it will be empty
		await browser.sleep(1000);
		element(by.name('form')).submit();

		await browser.sleep(1000);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual('Must add segments to the path');
		await browser.sleep(1000);
	});

	it('should not submit with sucess because of First Node is missing', async function() {
		await browser.get('http://localhost:4200/registrations/path');
		await browser.waitForAngularEnabled(true);

		element(by.name('key')).sendKeys('pathTest2');
		element(by.name('line')).sendKeys('lineTestForPath');
		element(by.name('type')).sendKeys('Go');

		element(by.name('node1')).sendKeys('');
		element(by.name('node2')).sendKeys('shortname2');
		element(by.name('duration')).sendKeys(10);
		element(by.name('distance')).sendKeys(10);
		await browser.sleep(500);
		element(by.name('Define')).click();

		await browser.sleep(1000);
		await element(by.name('ErrorMessage')).getText();
		await browser.sleep(500);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual('Data is missing from path segments');
		await browser.sleep(500);
		element(by.name('form')).submit();

		await browser.sleep(500);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual('Must add segments to the path');
		await browser.sleep(500);
	});

	it('should not submit with sucess because of Second Node is missing', async function() {
		await browser.get('http://localhost:4200/registrations/path');
		await browser.waitForAngularEnabled(true);

		element(by.name('key')).sendKeys('pathTest2');
		element(by.name('line')).sendKeys('lineTestForPath');
		element(by.name('type')).sendKeys('Go');

		element(by.name('node1')).sendKeys('shortname1');
		element(by.name('node2')).sendKeys('');
		element(by.name('duration')).sendKeys(10);
		element(by.name('distance')).sendKeys(10);
		await browser.sleep(500);
		element(by.name('Define')).click();

		await browser.sleep(1000);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual('Data is missing from path segments');
		await browser.sleep(1000);
		element(by.name('form')).submit();
		await browser.sleep(1000);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual('Must add segments to the path');
	});

	it('should not submit with sucess because of duration is missing', async function() {
		await browser.get('http://localhost:4200/registrations/path');
		await browser.waitForAngularEnabled(true);

		element(by.name('key')).sendKeys('pathTest2');
		element(by.name('line')).sendKeys('lineTestForPath');
		element(by.name('type')).sendKeys('Go');

		element(by.name('node1')).sendKeys('shortname1');
		element(by.name('node2')).sendKeys('shortname2');
		element(by.name('duration')).sendKeys(0);
		element(by.name('distance')).sendKeys(10);
		await browser.sleep(1000);
		element(by.name('Define')).click();

		await browser.sleep(1000);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual('Data is missing from path segments');
		await browser.sleep(1000);
		element(by.name('form')).submit();
		await browser.sleep(1000);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual('Must add segments to the path');
		await browser.sleep(500);
	});

	it('should not submit with sucess because of distance is missing', async function() {
		await browser.get('http://localhost:4200/registrations/path');
		await browser.waitForAngularEnabled(true);

		element(by.name('key')).sendKeys('pathTest2');
		element(by.name('line')).sendKeys('lineTestForPath');
		element(by.name('type')).sendKeys('Go');

		element(by.name('node1')).sendKeys('shortname1');
		element(by.name('node2')).sendKeys('shortname2');
		element(by.name('duration')).sendKeys(10);
		element(by.name('distance')).sendKeys(0);

		await browser.sleep(1000);
		element(by.name('Define')).click();

		await browser.sleep(1000);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual('Data is missing from path segments');
		await browser.sleep(1000);
		element(by.name('form')).submit();
		await browser.sleep(1000);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual('Must add segments to the path');
		await browser.sleep(500);
	});

	it('should not submit with sucess because of nodes are equal', async function() {
		await browser.get('http://localhost:4200/registrations/path');
		await browser.waitForAngularEnabled(true);

		element(by.name('key')).sendKeys('pathTest2');
		element(by.name('line')).sendKeys('lineTestForPath');
		element(by.name('type')).sendKeys('Go');

		element(by.name('node1')).sendKeys('shortname1');
		element(by.name('node2')).sendKeys('shortname1');
		element(by.name('duration')).sendKeys(10);
		element(by.name('distance')).sendKeys(10);
		await browser.sleep(1000);
		element(by.name('Define')).click();

		await browser.sleep(1000);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual('Nodes of path segments cant be equal');
		await browser.sleep(1000);
		element(by.name('form')).submit();
		await browser.sleep(1000);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual('Must add segments to the path');
		await browser.sleep(500);
	});
});
