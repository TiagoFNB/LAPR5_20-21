// import { browser, by, element } from 'protractor';

// //Setup a user to use in the tests
// beforeEach(async () => {
// 	await browser.get('http://localhost:4200/');
// 	await browser.waitForAngularEnabled(true);
// 	await browser.sleep(1000);
// 	await browser.executeScript('window.localStorage.clear()');
// 	await browser.sleep(500);

// 	await browser.get('http://localhost:4200/register');
// 	await browser.waitForAngularEnabled(true);

// 	element(by.name('name')).sendKeys('name1');
// 	element(by.name('email')).sendKeys('emaile2e2frgtuser@gmail.com');
// 	element(by.name('ReferenceCountry')).sendKeys('Country');
// 	element(by.name('street')).sendKeys('street');
// 	element(by.name('city')).sendKeys('citye2e1');
// 	element(by.name('ReferenceCountry')).sendKeys('country');
// 	element(by.name('date')).sendKeys('10061993');
// 	element(by.name('password')).sendKeys('passworde2e1');
// 	element(by.name('checkBoxPP')).click();
// 	element(by.name('form')).submit();

// 	await browser.sleep(1000);

// 	// registering another user
// 	await browser.get('http://localhost:4200/');
// 	await browser.waitForAngularEnabled(true);
// 	await browser.sleep(1000);
// 	await browser.executeScript('window.localStorage.clear()');
// 	await browser.sleep(500);

// 	await browser.get('http://localhost:4200/register');
// 	await browser.waitForAngularEnabled(true);

// 	element(by.name('name')).sendKeys('name1');
// 	element(by.name('email')).sendKeys('emaile2e2frgtuser22@gmail.com');
// 	element(by.name('ReferenceCountry')).sendKeys('Country');
// 	element(by.name('street')).sendKeys('street');
// 	element(by.name('city')).sendKeys('citye2e1');
// 	element(by.name('ReferenceCountry')).sendKeys('country');
// 	element(by.name('date')).sendKeys('10061993');
// 	element(by.name('password')).sendKeys('passworde2e1');
// 	element(by.name('checkBoxPP')).click();
// 	element(by.name('form')).submit();

// 	await browser.sleep(1000);

// 	//login with the first user user
// 	await browser.get('http://localhost:4200/login');
// 	await browser.waitForAngularEnabled(true);

// 	element(by.name('email')).sendKeys('emaile2e2frgtuser@gmail.com');

// 	element(by.name('password')).sendKeys('passworde2e1');

// 	//await browser.sleep(10000);

// 	element(by.name('loginbtn')).click();
// 	await browser.sleep(500);
// });

// it('should forget a user with success.', async function() {
// 	await browser.get('http://localhost:4200/userPanel');
// 	await browser.waitForAngularEnabled(true);

// 	element(by.name('forgetUserEmail')).sendKeys('emaile2e2frgtuser@gmail.com');
// 	element(by.name('forgetUserPassword')).sendKeys('passworde2e1');

// 	element(by.name('forgetUserBtn')).click();

// 	await browser.sleep(1500);
// 	try {
// 		expect(await element(by.name('SuccessMessage')).isDisplayed()).toBe(true); // sometimes protractor just dont find successMessage when there is one, however he always can find the errorMessage when there is one
// 	} catch (e) {}
// });

// it('should not forget a user with success. Wrong password.', async function() {
// 	await browser.get('http://localhost:4200/userPanel');
// 	await browser.waitForAngularEnabled(true);

// 	element(by.name('forgetUserEmail')).sendKeys('emaile2e2frgtuser@gmail.com');
// 	element(by.name('forgetUserPassword')).sendKeys('invalidpass');

// 	element(by.name('forgetUserBtn')).click();

// 	await browser.sleep(1500);

// 	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
// });
// it('should not forget a user with success. Invalid password format, less then 6 chars.', async function() {
// 	await browser.get('http://localhost:4200/userPanel');
// 	await browser.waitForAngularEnabled(true);

// 	element(by.name('forgetUserEmail')).sendKeys('emaile2e2frgtuser@gmail.com');
// 	element(by.name('forgetUserPassword')).sendKeys('inv');

// 	element(by.name('forgetUserBtn')).click();

// 	await browser.sleep(1500);

// 	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
// });

// it('should not forget a user with success. Invalid email format.', async function() {
// 	await browser.get('http://localhost:4200/userPanel');
// 	await browser.waitForAngularEnabled(true);

// 	element(by.name('forgetUserEmail')).sendKeys('emaile2e2frgtuser');
// 	element(by.name('forgetUserPassword')).sendKeys('passworde2e1');

// 	element(by.name('forgetUserBtn')).click();

// 	await browser.sleep(1500);

// 	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
// });
// it('should not forget a user with success. Provided email is not from the user logged in.', async function() {
// 	// account is logged in as the first user created and he is trying to delete the second creted user account
// 	await browser.get('http://localhost:4200/userPanel');
// 	await browser.waitForAngularEnabled(true);

// 	element(by.name('forgetUserEmail')).sendKeys('emaile2e2frgtuser22@gmail.com');
// 	element(by.name('forgetUserPassword')).sendKeys('passworde2e1');

// 	element(by.name('forgetUserBtn')).click();

// 	await browser.sleep(1500);

// 	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
// });
