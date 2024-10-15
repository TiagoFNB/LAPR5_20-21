import { getMaxListeners } from 'process';
import { browser, by, element } from 'protractor';

describe('Nodes Registration', function() {
	beforeAll(async () => {
		await browser.get('http://localhost:4200/');
		await browser.waitForAngularEnabled(true);
		await browser.sleep(1000);

		browser.executeScript(
			`window.localStorage.setItem('currentUser', '{"email":"rogernio@gmail.com","role":"Admin","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlJvZ2VyaW8iLCJEYXRlT2ZCaXJ0aCI6IjcvMjEvMTk5MyIsImV4cCI6MTYxMzYwMDQxOCwiaXNzIjoicm9nZXIuY29tIiwiYXVkIjoicm9nZXIuY29tIn0.AtKnp80t6KfwxSSBLBmUofr4mjRMWNH0tJGRzQBpyWM"}');`
		);
		//window.localStorage.setItem('currentUser', JSON.stringify(logedUser));
		browser.executeScript('window.localStorage.getItem("currentUser")');

		await browser.sleep(2000);
	});

	it('should submit with sucess ', async function() {
		await browser.get('http://localhost:4200/registrations/node');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('namenodetest1');
		element(by.name('shortName')).sendKeys('nodetest1');
		element(by.name('Latitude')).sendKeys(10);
		element(by.name('Longitude')).sendKeys(20);
		element(by.name('depot')).click();
		element(by.name('Relief')).sendKeys('true');
		element(by.name('Duration')).sendKeys(10);

		//await browser.sleep(10000);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(15000);

		expect(await element(by.name('SuccessMessage')).isDisplayed()).toBe(true);
		expect(await element(by.name('SuccessMessage')).getText()).toEqual('Node Created Sucessfully');
	});

	it('should submit with sucess a node with reference node ', async function() {
		await browser.get('http://localhost:4200/registrations/node');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('namenodetest2');
		element(by.name('shortName')).sendKeys('nodetest2');
		element(by.name('Latitude')).sendKeys(10);
		element(by.name('Longitude')).sendKeys(20);
		element(by.name('depot')).click();
		element(by.name('Relief')).sendKeys('true');
		element(by.name('Duration')).sendKeys(10);
		element(by.name('ReferenceNode')).sendKeys('nodetest1');

		//await browser.sleep(10000);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(15000);

		//await browser.sleep(20000);
		expect(await element(by.name('SuccessMessage')).isDisplayed()).toBe(true);
		expect(await element(by.name('SuccessMessage')).getText()).toEqual('Node Created Sucessfully');

		//expect(await element(by.name('ErrorMessage')).isDisplayed).toBe(false);
	});

	it('should not  submit with success because of duplicate id (shortName)', async function() {
		await browser.get('http://localhost:4200/registrations/node');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('namenodetest3');
		element(by.name('shortName')).sendKeys('nodetest1');
		element(by.name('Latitude')).sendKeys(10);
		element(by.name('Longitude')).sendKeys(20);
		element(by.name('depot')).click();
		element(by.name('Relief')).sendKeys('true');
		element(by.name('Duration')).sendKeys(10);

		//await browser.sleep(10000);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(4000);
		await element(by.name('ErrorMessage')).getText();
		//await browser.sleep(20000);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual(
			'Error: That node already exists in the system'
		);
	});

	it('should not  submit with sucess becouse of required field  (shortName)', async function() {
		await browser.get('http://localhost:4200/registrations/node');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('nodetest1');

		element(by.name('Latitude')).sendKeys(10);
		element(by.name('Longitude')).sendKeys(20);
		element(by.name('depot')).click();
		element(by.name('Relief')).sendKeys('true');
		element(by.name('Duration')).sendKeys(10);

		//await browser.sleep(10000);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(1000);

		// there should be no error message as the error is displayed in template itself
		let verifyTheresNoErrorMessage = false;
		try {
			await element(by.name('ErrorMessage')).catch((err) => {
				verifyTheresNoErrorMessage = true;
			});
		} catch (err) {
			verifyTheresNoErrorMessage = true;
		}
		expect(verifyTheresNoErrorMessage).toBe(true);

		expect(await element(by.name('ShortNameRequired')).getText()).toEqual('Short name is required'); // This is wrong!
	});

	it('should not  submit with sucess becouse of required field  (Name)', async function() {
		await browser.get('http://localhost:4200/registrations/node');
		await browser.waitForAngularEnabled(true);

		element(by.name('shortName')).sendKeys('shh1');
		element(by.name('Latitude')).sendKeys(10);
		element(by.name('Longitude')).sendKeys(20);
		element(by.name('depot')).click();
		element(by.name('Relief')).sendKeys('true');
		element(by.name('Duration')).sendKeys(10);

		//await browser.sleep(10000);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(1000);

		// there should be no error message as the error is displayed in template itself
		let verifyTheresNoErrorMessage = false;
		try {
			await element(by.name('ErrorMessage')).catch((err) => {
				verifyTheresNoErrorMessage = true;
			});
		} catch (err) {
			verifyTheresNoErrorMessage = true;
		}
		expect(verifyTheresNoErrorMessage).toBe(true);

		expect(await element(by.name('NameRequired')).getText()).toEqual('Name is required'); // This is wrong!
	});

	it('should not  submit with sucess becouse of required field  (Latitude)', async function() {
		await browser.get('http://localhost:4200/registrations/node');
		await browser.waitForAngularEnabled(true);
		element(by.name('name')).sendKeys('supername');
		element(by.name('shortName')).sendKeys('shh1');

		element(by.name('Longitude')).sendKeys(20);
		element(by.name('depot')).click();
		element(by.name('Relief')).sendKeys('true');
		element(by.name('Duration')).sendKeys(10);

		//await browser.sleep(10000);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(1000);

		// there should be no error message as the error is displayed in template itself
		let verifyTheresNoErrorMessage = false;
		try {
			await element(by.name('ErrorMessage')).catch((err) => {
				verifyTheresNoErrorMessage = true;
			});
		} catch (err) {
			verifyTheresNoErrorMessage = true;
		}
		expect(verifyTheresNoErrorMessage).toBe(true);

		expect(await element(by.name('LatitudeRequired')).getText()).toEqual('Latitude is required');
	});

	it('should not  submit with sucess becouse of required field  (Longitude)', async function() {
		await browser.get('http://localhost:4200/registrations/node');
		await browser.waitForAngularEnabled(true);
		element(by.name('name')).sendKeys('supername');
		element(by.name('shortName')).sendKeys('shh1');
		element(by.name('Latitude')).sendKeys(10);

		element(by.name('depot')).click();
		element(by.name('Relief')).sendKeys('true');
		element(by.name('Duration')).sendKeys(10);

		//await browser.sleep(10000);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(1000);

		// there should be no error message as the error is displayed in template itself
		let verifyTheresNoErrorMessage = false;
		try {
			await element(by.name('ErrorMessage')).catch((err) => {
				verifyTheresNoErrorMessage = true;
			});
		} catch (err) {
			verifyTheresNoErrorMessage = true;
		}
		expect(verifyTheresNoErrorMessage).toBe(true);

		expect(await element(by.name('LongitudeRequired')).getText()).toEqual('Longitude is required');
	});

	it('should not  submit with sucess becouse of required field  (Theres a crew travel time reference node but no duration)', async function() {
		await browser.get('http://localhost:4200/registrations/node');
		await browser.waitForAngularEnabled(true);
		element(by.name('name')).sendKeys('supername');
		element(by.name('shortName')).sendKeys('shh1');
		element(by.name('Latitude')).sendKeys(10);
		element(by.name('Longitude')).sendKeys(20);
		element(by.name('depot')).click();
		element(by.name('Relief')).sendKeys('true');

		element(by.name('ReferenceNode')).sendKeys('refNode');
		//await browser.sleep(10000);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(1000);

		expect(await element(by.name('ErrorMessage')).getText()).toEqual(
			'An unexpected error happened, check the required fields and if you specify a reference node dont forget to specify the duration'
		);
	});
});
