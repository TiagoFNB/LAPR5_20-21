import { browser, by, element } from 'protractor';

describe('Register driver type  E2E tests with all possible fields', function() {
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
	});

	it('driver type submit successful ', async function() {
		await browser.get('http://localhost:4200/registrations/driverType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('testE2E1');
		element(by.name('Description')).sendKeys('desc1');

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(4000);

		//await browser.sleep(20000);
		expect(await element(by.name('SuccessMessage')).isDisplayed()).toBe(true);
		expect(await element(by.name('SuccessMessage')).getText()).toEqual('Creation of DriverType successful');

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('driver type submit fail case 1, duplicated name ', async function() {
		await browser.get('http://localhost:4200/registrations/driverType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('testE2E1');
		element(by.name('Description')).sendKeys('desc1');

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(4000);

		//await browser.sleep(20000);
		expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
		//await browser.sleep(20000);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual(
			'ERROR: The DriverType you are trying to create already exists in the database'
		);

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('driver type submit fail case 2, name is required ', async function() {
		await browser.get('http://localhost:4200/registrations/driverType');
		await browser.waitForAngularEnabled(true);

		element(by.name('Description')).sendKeys('testE2E1');

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(4000);

		try {
			expect(await element(by.name('SuccessMessage'))).toBeDefined();
			fail;
		} catch (err) {
			try {
				expect(await element(by.name('SuccessMessage'))).toBeDefined();
				fail;
			} catch (err) {}
		}
		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('driver type submit fail case 3, desc is required ', async function() {
		await browser.get('http://localhost:4200/registrations/driverType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('desc1');

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(4000);

		try {
			expect(await element(by.name('SuccessMessage'))).toBeDefined();
			fail;
		} catch (err) {
			try {
				expect(await element(by.name('SuccessMessage'))).toBeDefined();
				fail;
			} catch (err) {}
		}
		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});
});
