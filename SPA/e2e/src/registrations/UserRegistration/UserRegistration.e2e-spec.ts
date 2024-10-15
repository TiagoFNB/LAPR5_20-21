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
	element(by.name('email')).sendKeys('emaile2e1@gmail.com');
	element(by.name('ReferenceCountry')).sendKeys('Country');
	element(by.name('street')).sendKeys('street');
	element(by.name('city')).sendKeys('citye2e1');
	element(by.name('ReferenceCountry')).sendKeys('country');
	element(by.name('date')).sendKeys('10061993');
	element(by.name('password')).sendKeys('passworde2e1');

	//await browser.sleep(10000);

	element(by.name('form')).submit();
	//await browser.sleep(10000);
	//element(by.name('buttonSubmit')).click();

	await browser.sleep(4000);
});

it('should not  submit with sucess  error case 1', async function() {
	// too young
	await browser.get('http://localhost:4200/register');
	await browser.waitForAngularEnabled(true);

	element(by.name('name')).sendKeys('name1');
	element(by.name('email')).sendKeys('emaile2e2@gmail.com');
	element(by.name('ReferenceCountry')).sendKeys('Country');
	element(by.name('street')).sendKeys('street');
	element(by.name('city')).sendKeys('citye2e1');

	element(by.name('date')).sendKeys('10062020');
	element(by.name('password')).sendKeys('passworde2e1');
	element(by.name('checkBoxPP')).click();
	//await browser.sleep(10000);

	element(by.name('form')).submit();
	//await browser.sleep(10000);
	//element(by.name('buttonSubmit')).click();

	await browser.sleep(4300);

	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
});

it('should not  submit with sucess  error case 2', async function() {
	// invalid name
	await browser.get('http://localhost:4200/register');
	await browser.waitForAngularEnabled(true);

	element(by.name('name')).sendKeys('n');
	element(by.name('email')).sendKeys('emaile2e2@gmail.com');
	element(by.name('ReferenceCountry')).sendKeys('Country');
	element(by.name('street')).sendKeys('street');
	element(by.name('city')).sendKeys('citye2e1');

	element(by.name('date')).sendKeys('10061993');
	element(by.name('password')).sendKeys('passworde2e1');
	element(by.name('checkBoxPP')).click();
	//await browser.sleep(10000);

	element(by.name('form')).submit();

	await browser.sleep(4300);

	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
});

it('should not  submit with sucess  error case 3', async function() {
	// invalid email
	await browser.get('http://localhost:4200/register');
	await browser.waitForAngularEnabled(true);

	element(by.name('name')).sendKeys('name');
	element(by.name('email')).sendKeys('emaile2e2');
	element(by.name('ReferenceCountry')).sendKeys('Country');
	element(by.name('street')).sendKeys('street');
	element(by.name('city')).sendKeys('citye2e1');

	element(by.name('date')).sendKeys('10061993');
	element(by.name('password')).sendKeys('passworde2e1');
	element(by.name('checkBoxPP')).click();
	element(by.name('form')).submit();
	//await browser.sleep(10000);
	//element(by.name('buttonSubmit')).click();

	await browser.sleep(4300);

	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
});

it('should not  submit with sucess  error case 4', async function() {
	// invalid country
	await browser.get('http://localhost:4200/register');
	await browser.waitForAngularEnabled(true);

	element(by.name('name')).sendKeys('name');
	element(by.name('email')).sendKeys('emaile2e2@gmail.com');
	element(by.name('ReferenceCountry')).sendKeys('c');
	element(by.name('street')).sendKeys('street');
	element(by.name('city')).sendKeys('citye2e1');

	element(by.name('date')).sendKeys('10061993');
	element(by.name('password')).sendKeys('passworde2e1');
	element(by.name('checkBoxPP')).click();
	//await browser.sleep(10000);

	element(by.name('form')).submit();
	//await browser.sleep(10000);
	//element(by.name('buttonSubmit')).click();

	await browser.sleep(4300);

	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
});
it('should not  submit with sucess  error case 5', async function() {
	// invalid street
	await browser.get('http://localhost:4200/register');
	await browser.waitForAngularEnabled(true);

	element(by.name('name')).sendKeys('name');
	element(by.name('email')).sendKeys('emaile2e1@gmail.com');
	element(by.name('ReferenceCountry')).sendKeys('country');
	element(by.name('street')).sendKeys('s');
	element(by.name('city')).sendKeys('citye2e1');

	//element(by.name('date')).click();

	//	element(by.name('date')).sendKeys('2171993333333');
	// element(by.name('date')).click();
	// element(by.name('date')).clear();
	// element(by.name('date')).click();
	// element(by.name('date')).clear();
	// element(by.name('date')).click();
	// element(by.name('date')).clear();
	element(by.name('date')).sendKeys('10061993');
	element(by.name('password')).sendKeys('passworde2e1');
	element(by.name('checkBoxPP')).click();
	//await browser.sleep(10000);

	element(by.name('form')).submit();
	//await browser.sleep(10000);
	//element(by.name('buttonSubmit')).click();

	await browser.sleep(4300);

	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
});

it('should not  submit with sucess  error case 6', async function() {
	// invalid date
	await browser.get('http://localhost:4200/register');
	await browser.waitForAngularEnabled(true);

	element(by.name('name')).sendKeys('name');
	element(by.name('email')).sendKeys('emaile2e1@gmail.com');
	element(by.name('ReferenceCountry')).sendKeys('country');
	element(by.name('street')).sendKeys('street');
	element(by.name('city')).sendKeys('citye2e1');

	element(by.name('date')).sendKeys('1993');
	element(by.name('password')).sendKeys('passworde2e1');
	element(by.name('checkBoxPP')).click();
	element(by.name('form')).submit();

	await browser.sleep(4300);

	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
});

it('should not  submit with sucess  error case 7', async function() {
	// invalid password
	await browser.get('http://localhost:4200/register');
	await browser.waitForAngularEnabled(true);

	element(by.name('name')).sendKeys('name');
	element(by.name('email')).sendKeys('emaile2e2@gmail.com');
	element(by.name('ReferenceCountry')).sendKeys('country');
	element(by.name('street')).sendKeys('street');
	element(by.name('city')).sendKeys('citye2e1');

	element(by.name('date')).sendKeys('10061993');
	element(by.name('password')).sendKeys('pass');
	element(by.name('checkBoxPP')).click();
	//await browser.sleep(10000);

	element(by.name('form')).submit();
	//await browser.sleep(10000);
	//element(by.name('buttonSubmit')).click();

	await browser.sleep(4300);

	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
});
it('should not submit with sucess error case 8', async function() {
	// user with such email already exists
	await browser.get('http://localhost:4200/register');
	await browser.waitForAngularEnabled(true);

	element(by.name('name')).sendKeys('name1');
	element(by.name('email')).sendKeys('emaile2e1@gmail.com');
	element(by.name('ReferenceCountry')).sendKeys('Country');
	element(by.name('street')).sendKeys('street');
	element(by.name('city')).sendKeys('citye2e1');

	element(by.name('date')).sendKeys('10061993');
	element(by.name('password')).sendKeys('passworde2e1');
	element(by.name('checkBoxPP')).click();
	//await browser.sleep(10000);

	element(by.name('form')).submit();
	//await browser.sleep(10000);
	//element(by.name('buttonSubmit')).click();

	await browser.sleep(4300);

	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
});
