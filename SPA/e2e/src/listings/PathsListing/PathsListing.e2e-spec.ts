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

	element(by.name('name')).sendKeys('PathsListTestNode01');
	element(by.name('shortName')).sendKeys('PathsListTestNode01');
	element(by.name('Latitude')).sendKeys(10);
	element(by.name('Longitude')).sendKeys(20);
	element(by.name('depot')).click();
	element(by.name('Relief')).sendKeys('true');
	element(by.name('Duration')).sendKeys(10);

	element(by.name('form')).submit();

    await browser.sleep(500);
    
    await browser.get('http://localhost:4200/registrations/node');
	await browser.waitForAngularEnabled(true);

	element(by.name('name')).sendKeys('PathsListTestNode02');
	element(by.name('shortName')).sendKeys('PathsListTestNode02');
	element(by.name('Latitude')).sendKeys(10);
	element(by.name('Longitude')).sendKeys(20);
	element(by.name('depot')).click();
	element(by.name('Relief')).sendKeys('true');
	element(by.name('Duration')).sendKeys(10);

	element(by.name('form')).submit();

    await browser.sleep(500);

    //Creates 2 lines

    await browser.get('http://localhost:4200/registrations/line-registration');
	await browser.waitForAngularEnabled(true);

	element(by.name('code')).sendKeys('PathsListTestLine01');
	element(by.name('Name')).sendKeys('PathsListTestLine01');
	element(by.name('terminalNode1')).sendKeys('PathsListTestNode01');
	element(by.name('terminalNode2')).sendKeys('PathsListTestNode02');

    await browser.sleep(500);
	element(by.name('form')).submit();

    await browser.sleep(1500);
    
    await browser.get('http://localhost:4200/registrations/line-registration');
	await browser.waitForAngularEnabled(true);

	element(by.name('code')).sendKeys('PathsListTestLine02');
	element(by.name('Name')).sendKeys('PathsListTestLine02');
	element(by.name('terminalNode1')).sendKeys('PathsListTestNode01');
	element(by.name('terminalNode2')).sendKeys('PathsListTestNode02');

    await browser.sleep(500);
	element(by.name('form')).submit();

	await browser.sleep(1500);
    
    //Create 2 paths

    await browser.get('http://localhost:4200/registrations/path');
		await browser.waitForAngularEnabled(true);

		element(by.name('key')).sendKeys('PathsListTestPath01');
		element(by.name('line')).sendKeys('PathsListTestLine01');
		element(by.name('type')).sendKeys('Go');

		element(by.name('node1')).sendKeys('PathsListTestNode01');
		element(by.name('node2')).sendKeys('PathsListTestNode02');
		element(by.name('duration')).sendKeys(10);
		element(by.name('distance')).sendKeys(10);

		await browser.sleep(1000);
		element(by.name('Define')).click();

		await browser.sleep(1000);

		element(by.name('form')).submit();

		await browser.sleep(1000);


        await browser.get('http://localhost:4200/registrations/path');
		await browser.waitForAngularEnabled(true);

		element(by.name('key')).sendKeys('PathsListTestPath02');
		element(by.name('line')).sendKeys('PathsListTestLine02');
		element(by.name('type')).sendKeys('Go');

		element(by.name('node1')).sendKeys('PathsListTestNode01');
		element(by.name('node2')).sendKeys('PathsListTestNode02');
		element(by.name('duration')).sendKeys(10);
		element(by.name('distance')).sendKeys(10);

		await browser.sleep(1000);
		element(by.name('Define')).click();

		await browser.sleep(1000);

		element(by.name('form')).submit();

		await browser.sleep(1000);

});

describe('Paths Listing', function() {
	it('Paths should be listed', async function() {
		await browser.get('http://localhost:4200/listings/paths');
		await browser.waitForAngularEnabled(true);

		await browser.sleep(1000);

        //Check if necessary elements are present
        expect(await element(by.name('PathKey')).isPresent()).toBe(true,'Key parameter should exist');
        expect(await element(by.name('PathLine')).isPresent()).toBe(true),'Line parameter should exist';
        expect(await element(by.name('PathType')).isPresent()).toBe(true),'Type parameter should exist';

        await browser.sleep(1000);

        //Check if this lines exist in the table
        expect(await element(by.id('rowPath-PathsListTestPath01')).isPresent()).toBe(true,'Path should exist');
        expect(await element(by.id('rowPath-PathsListTestPath02')).isPresent()).toBe(true,'Path should exist');


        //Test the filters
        element(by.name('PathLine')).sendKeys('PathsListTestLine02');

        await browser.sleep(1000);

        expect(await element(by.id('rowPath-PathsListTestPath01')).isPresent()).toBe(false,"Shouldn't find line after filter");
        expect(await element(by.id('rowPath-PathsListTestPath02')).isPresent()).toBe(true,'Should find line after filter');
    });
});