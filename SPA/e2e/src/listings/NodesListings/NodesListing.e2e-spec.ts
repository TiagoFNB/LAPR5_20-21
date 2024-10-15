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

	//Creates 2 nodes
	await browser.get('http://localhost:4200/registrations/node');
	await browser.waitForAngularEnabled(true);

	element(by.name('name')).sendKeys('nodeListTestNode01');
	element(by.name('shortName')).sendKeys('nodeListTestNode01shrt');
	element(by.name('Latitude')).sendKeys(10);
	element(by.name('Longitude')).sendKeys(20);
	element(by.name('depot')).click();
	element(by.name('Relief')).sendKeys('true');

	element(by.name('form')).submit();

	await browser.sleep(500);

	await browser.get('http://localhost:4200/registrations/node');
	await browser.waitForAngularEnabled(true);

	element(by.name('name')).sendKeys('nodeListTestNode02');
	element(by.name('shortName')).sendKeys('nodeListTestNode02shrt');
	element(by.name('Latitude')).sendKeys(10);
	element(by.name('Longitude')).sendKeys(20);
	element(by.name('depot')).click();
	element(by.name('Relief')).sendKeys('true');

	element(by.name('form')).submit();

	await browser.sleep(500);
});

describe('Nodes Listing', function() {
	it('Nodes should be listed', async function() {
		await browser.get('http://localhost:4200/listings/nodes');
		await browser.waitForAngularEnabled(true);

		await browser.sleep(1000);

		//Check if necessary elements are present
		expect(await element(by.name('NodeShortName')).isPresent()).toBe(
			true,
			'Cheking if able to filter by Short Name'
		);
		expect(await element(by.name('NodeName')).isPresent()).toBe(true, 'Cheking if able to filter by  Name');
		expect(await element(by.name('NodeLatitude')).isPresent()).toBe(true, 'Cheking if able to filter by Latitude');
		expect(await element(by.name('NodeLongitude')).isPresent()).toBe(
			true,
			'Cheking if able to filter by Longitude'
		);

		await browser.sleep(2000);

		//Check if this nodes exist in the table
		expect(await element(by.id('RowOfNode-nodeListTestNode01shrt')).isPresent()).toBe(
			true,
			'Cheking if node with such sort name exists t1'
		);
		expect(await element(by.id('RowOfNode-nodeListTestNode02shrt')).isPresent()).toBe(
			true,
			'Cheking if node with such sort name exists t2'
		);

		//Test the filters
		element(by.name('NodeShortName')).sendKeys('nodeListTestNode01shrt');

		await browser.sleep(1000);

		expect(await element(by.id('RowOfNode-nodeListTestNode01shrt')).isPresent()).toBe(
			true,
			'Cheking if node filter by short name works t1'
		);
		expect(await element(by.id('RowOfNode-nodeListTestNode02shrt')).isPresent()).toBe(
			false,
			'Cheking if node filter by short name works t2'
		);
	});
});
