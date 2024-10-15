import { browser, by, element } from 'protractor';

//Setup a node to use in the tests
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

	//Creates a single node
	await browser.get('http://localhost:4200/registrations/node');
	await browser.waitForAngularEnabled(true);

	element(by.name('name')).sendKeys('lineTestNode01');
	element(by.name('shortName')).sendKeys('lineTestNode01');
	element(by.name('Latitude')).sendKeys(10);
	element(by.name('Longitude')).sendKeys(20);
	element(by.name('depot')).click();
	element(by.name('Relief')).sendKeys('true');
	element(by.name('Duration')).sendKeys(10);

	element(by.name('form')).submit();

	await browser.sleep(500);
});

describe('Line Registration', function() {
	it('Line should be registered successfully and may not be registered again with the same code', async function() {
		await browser.get('http://localhost:4200/registrations/line-registration');
		await browser.waitForAngularEnabled(true);

		element(by.name('code')).sendKeys('lineTest01');
		element(by.name('Name')).sendKeys('lineTest01');
		element(by.name('terminalNode1')).sendKeys('lineTestNode01');
		element(by.name('terminalNode2')).sendKeys('lineTestNode01');

		element(by.name('form')).submit();

		await browser.sleep(500);

		expect(await element(by.name('successMessage')).getText()).toEqual('Line was successfully registered.');

		await browser.get('http://localhost:4200/registrations/line-registration');
		//Try for duplicate key, form needs to be filled again
		element(by.name('code')).sendKeys('lineTest01');
		element(by.name('Name')).sendKeys('lineTest01');
		element(by.name('terminalNode1')).sendKeys('lineTestNode01');
		element(by.name('terminalNode2')).sendKeys('lineTestNode01');

		element(by.name('form')).submit();

		await browser.sleep(500);

		expect(await element(by.name('errorMessage')).getText()).toEqual('Submitted line code already exists.');
	});

	it('Line should not be registered (code is missing)', async function() {
		await browser.get('http://localhost:4200/registrations/line-registration');
		await browser.waitForAngularEnabled(true);

		element(by.name('Name')).sendKeys('lineTest01');
		element(by.name('terminalNode1')).sendKeys('lineTestNode01');
		element(by.name('terminalNode2')).sendKeys('lineTestNode01');

		element(by.name('form')).submit();

		await browser.sleep(500);

		//Form was not submitted since no message has been received
		try {
			expect(await element(by.name('successMessage'))).toBeDefined();
			fail;
		} catch (err) {
			try {
				expect(await element(by.name('successMessage'))).toBeDefined();
				fail;
			} catch (err) {}
		}
	});

	it('Line should not be registered (name is missing)', async function() {
		await browser.get('http://localhost:4200/registrations/line-registration');
		await browser.waitForAngularEnabled(true);

		element(by.name('code')).sendKeys('lineTest01');
		element(by.name('terminalNode1')).sendKeys('lineTestNode01');
		element(by.name('terminalNode2')).sendKeys('lineTestNode01');

		element(by.name('form')).submit();

		await browser.sleep(500);

		//Form was not submitted since no message has been received
		try {
			expect(await element(by.name('successMessage'))).toBeDefined();
			fail;
		} catch (err) {
			try {
				expect(await element(by.name('successMessage'))).toBeDefined();
				fail;
			} catch (err) {}
		}
	});

	it('Line should not be registered (terminal Node is missing)', async function() {
		await browser.get('http://localhost:4200/registrations/line-registration');
		await browser.waitForAngularEnabled(true);

		element(by.name('Name')).sendKeys('lineTest01');
		element(by.name('code')).sendKeys('lineTest01');
		element(by.name('terminalNode2')).sendKeys('lineTestNode01');

		element(by.name('form')).submit();

		await browser.sleep(500);

		//Form was not submitted since no message has been received
		try {
			expect(await element(by.name('successMessage'))).toBeDefined();
			fail;
		} catch (err) {
			try {
				expect(await element(by.name('successMessage'))).toBeDefined();
				fail;
			} catch (err) {}
		}
	});

	it('Line should not be registered (element does not exist in db))', async function() {
		await browser.get('http://localhost:4200/registrations/line-registration');
		await browser.waitForAngularEnabled(true);

		element(by.name('code')).sendKeys('lineTest02');
		element(by.name('Name')).sendKeys('lineTest02');
		element(by.name('terminalNode1')).sendKeys('lineTestNode00');
		element(by.name('terminalNode2')).sendKeys('lineTestNode00');

		element(by.name('form')).submit();

		await browser.sleep(500);

		expect(await element(by.name('errorMessage')).getText()).toEqual(
			'Terminal Node: lineTestNode00 does not exist.'
		);
	});
});
