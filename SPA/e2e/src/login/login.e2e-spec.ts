import { browser, by, element } from 'protractor';

//Setup a node to use in the tests
beforeAll(async () => {
	await browser.get('http://localhost:4200/');
	await browser.waitForAngularEnabled(true);
	await browser.sleep(1000);
	await browser.executeScript('window.localStorage.clear()');
	await browser.sleep(500);

	await browser.get('http://localhost:4200/register');
	await browser.waitForAngularEnabled(true);

	element(by.name('name')).sendKeys('name1');
	element(by.name('email')).sendKeys('emaile2e1log1@gmail.com');
	element(by.name('ReferenceCountry')).sendKeys('Country');
	element(by.name('street')).sendKeys('street');
	element(by.name('city')).sendKeys('citye2e1');
	element(by.name('date')).sendKeys('10061993');
	element(by.name('password')).sendKeys('password');

	//await browser.sleep(10000);

	element(by.name('form')).submit();
	//await browser.sleep(10000);
	//element(by.name('buttonSubmit')).click();

	await browser.sleep(4000);
});

it('should login', async function() {
	await browser.get('http://localhost:4200/login');
	await browser.waitForAngularEnabled(true);

	element(by.name('email')).sendKeys('emaile2e1log1@gmail.com');

	element(by.name('password')).sendKeys('password');

	//await browser.sleep(10000);

	element(by.name('loginbtn')).click();
});
it('should not login', async function() {
	// invalid email
	await browser.get('http://localhost:4200/');
	await browser.waitForAngularEnabled(true);
	await browser.sleep(1000);
	await browser.executeScript('window.localStorage.clear()');
	await browser.sleep(500);

	await browser.get('http://localhost:4200/login');
	await browser.waitForAngularEnabled(true);

	element(by.name('email')).sendKeys('emaile2e1log22@gmail.com');

	element(by.name('password')).sendKeys('password');

	//await browser.sleep(10000);

	element(by.name('loginbtn')).click();
	//await browser.sleep(10000);
	//element(by.name('buttonSubmit')).click();

	await browser.sleep(4000);

	expect(await browser.getCurrentUrl()).toBe('http://localhost:4200/login'); // fails so stays in same page
	await browser.sleep(1000);
	await browser.executeScript('window.localStorage.clear()');
});
it('should  not login', async function() {
	// invalid email
	await browser.get('http://localhost:4200/');
	await browser.waitForAngularEnabled(true);
	await browser.sleep(1000);
	await browser.executeScript('window.localStorage.clear()');
	await browser.sleep(500);

	await browser.get('http://localhost:4200/login');
	await browser.waitForAngularEnabled(true);

	element(by.name('email')).sendKeys('emaile2e1log1@gmail.com');

	element(by.name('password')).sendKeys('passwoxpto');

	//await browser.sleep(10000);

	element(by.name('loginbtn')).click();
	//await browser.sleep(10000);
	//element(by.name('buttonSubmit')).click();

	await browser.sleep(4000);

	expect(await browser.getCurrentUrl()).toBe('http://localhost:4200/login'); // fails so stays in same page
	await browser.sleep(1000);
	await browser.executeScript('window.localStorage.clear()');
});
