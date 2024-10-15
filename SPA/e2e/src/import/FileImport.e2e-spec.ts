import { browser, by, element } from 'protractor';

describe('Import File  E2E tests with all possible fields', function() {
	var path = require('path');

	/*
it('should upload file', async function() {
    var fileToUpload = '../../../../MDR/System_Tests/TestFiles/drivertypes.xml';
    var absolutePath = path.resolve(__dirname, fileToUpload);
    await browser.get('http://localhost:4200/import');
		await browser.waitForAngularEnabled(true);

    element(by.name('file')).sendKeys(absolutePath);
    element(by.name('btnUp')).click();
    await browser.sleep(6000);
    expect(await element(by.name('message')).isDisplayed()).toBe(true);
    expect(await element(by.name('message')).getText()).toEqual('File is uploaded');

  });
  */

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

	it('should not allow to upload file', async function() {
		var fileToUpload = '../../../../MDR/System_Tests/TestFiles/download.png';
		var absolutePath = path.resolve(__dirname, fileToUpload);
		await browser.get('http://localhost:4200/import');
		await browser.waitForAngularEnabled(true);

		element(by.name('file')).sendKeys(absolutePath);

		await browser.sleep(2000);
		expect(await element(by.name('message')).isDisplayed()).toBe(true);
		expect(await element(by.name('message')).getText()).toEqual(
			'File extension not supported! Please insert a .glx or .xml file!'
		);
	});

	it('should allow to upload file, but there were erros logged', async function() {
		var fileToUpload = '../../../../MDR/System_Tests/TestFiles/drivertypesFailCase.xml';
		var absolutePath = path.resolve(__dirname, fileToUpload);
		await browser.get('http://localhost:4200/import');
		await browser.waitForAngularEnabled(true);

		element(by.name('file')).sendKeys(absolutePath);
		element(by.name('btnUp')).click();
		await browser.sleep(2000);
		expect(await element(by.name('message')).isDisplayed()).toBe(true);
		expect(await element(by.name('message')).getText()).toEqual('File was imported and there was 1 errors');
	});

	it('should allow to upload file, but there were erros logged. File also has information that both MDR and MDV tries to  import', async function() {
		var fileToUpload = '../../../../GLXFile/MDV_TestFiles/optTestFileForE2ETests.xml';
		var absolutePath = path.resolve(__dirname, fileToUpload);
		await browser.get('http://localhost:4200/import');
		await browser.waitForAngularEnabled(true);

		element(by.name('file')).sendKeys(absolutePath);
		element(by.name('btnUp')).click();
		await browser.sleep(10000);
		expect(await element(by.name('message')).isDisplayed()).toBe(true);
		expect(await element(by.name('message')).getText()).toEqual('File was imported and there was 237 errors');
	});
});
