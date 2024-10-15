import { browser, by, element } from 'protractor';


describe('Register driver  E2E tests with all possible fields', function() {
    
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

        await browser.get('http://localhost:4200/registrations/driverType');
		await browser.waitForAngularEnabled(true);

		element(by.name('name')).sendKeys('TESTE2ED1');
		element(by.name('Description')).sendKeys('desc1');

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		
		await browser.sleep(2000);
	});

	it('driver submit successful ', async function() {
		await browser.get('http://localhost:4200/registrations/driver');
		await browser.waitForAngularEnabled(true);

		element(by.name('driverName')).sendKeys('DriverE2ETest1');
        element(by.name('driverMechNumber')).sendKeys('789789789');
        element(by.name('DatePicker3')).sendKeys('01/01/2000');
        element(by.name('driverCitizenCardNumber')).sendKeys('00000000');
        element(by.name('driverFiscalNumber')).sendKeys('000000000');
        element(by.name('driverLicense')).sendKeys('P-00000000');
        element(by.name('DatePicker4')).sendKeys('01/01/2019');
        element(by.name('DatePicker')).sendKeys('01/01/2020');
        element(by.name('DatePicker2')).sendKeys('01/02/2020');
        element(by.name('type')).sendKeys('TESTE2ED1');
        

		await browser.sleep(200);

		element(by.name('form')).submit();
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

		await browser.sleep(4000);

       
		//await browser.sleep(20000);
		expect(await element(by.name('SuccessMessage')).isDisplayed()).toBe(true);
		expect(await element(by.name('SuccessMessage')).getText()).toEqual('Driver was successfully registered.');

		
	});

	it('driver submit fail case 1, duplicated name ', async function() {
		await browser.get('http://localhost:4200/registrations/driver');
		await browser.waitForAngularEnabled(true);

        element(by.name('driverName')).sendKeys('DriverE2ETest1');
        element(by.name('driverMechNumber')).sendKeys('789789789');
        element(by.name('DatePicker3')).sendKeys('01/01/2000');
        element(by.name('driverCitizenCardNumber')).sendKeys('00000000');
        element(by.name('driverFiscalNumber')).sendKeys('000000000');
        element(by.name('driverLicense')).sendKeys('P-00000000');
        element(by.name('DatePicker4')).sendKeys('01/01/2019');
        element(by.name('DatePicker')).sendKeys('01/01/2020');
        element(by.name('DatePicker2')).sendKeys('01/02/2020');
        element(by.name('type')).sendKeys('TESTE2ED1');
        
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

        await browser.sleep(200);

		element(by.name('form')).submit();
		await browser.sleep(4000);

        
		//await browser.sleep(20000);
		 expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
		// //await browser.sleep(20000);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual(
		 	'Error: That driver already exists in the system'
		 );

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('driver submit fail case 2, name is required ', async function() {

		await browser.get('http://localhost:4200/registrations/driver');
		await browser.waitForAngularEnabled(true);

		
        
        element(by.name('driverMechNumber')).sendKeys('789789789');
        element(by.name('DatePicker3')).sendKeys('01/01/2000');
        element(by.name('driverCitizenCardNumber')).sendKeys('00000000');
        element(by.name('driverFiscalNumber')).sendKeys('000000000');
        element(by.name('driverLicense')).sendKeys('P-00000000');
        element(by.name('DatePicker4')).sendKeys('01/01/2019');
        element(by.name('DatePicker')).sendKeys('01/01/2020');
        element(by.name('DatePicker2')).sendKeys('01/02/2020');
        element(by.name('type')).sendKeys('TESTE2ED1');
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

        await browser.sleep(200);

		element(by.name('form')).submit();
		await browser.sleep(4000);

        
            expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
            expect(await element(by.name('ErrorMessage')).getText()).toEqual(
		 	'Name is required'
		 );
	});

	it('driver submit fail case 3, mech number  is required ', async function() {
		await browser.get('http://localhost:4200/registrations/driver');
		await browser.waitForAngularEnabled(true);

        element(by.name('driverName')).sendKeys('DriverE2ETest1');
      
        element(by.name('DatePicker3')).sendKeys('01/01/2000');
        element(by.name('driverCitizenCardNumber')).sendKeys('00000000');
        element(by.name('driverFiscalNumber')).sendKeys('000000000');
        element(by.name('driverLicense')).sendKeys('P-00000000');
        element(by.name('DatePicker4')).sendKeys('01/01/2019');
        element(by.name('DatePicker')).sendKeys('01/01/2020');
        element(by.name('DatePicker2')).sendKeys('01/02/2020');
        element(by.name('type')).sendKeys('TESTE2ED1');
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

        await browser.sleep(200);

		element(by.name('form')).submit();
		await browser.sleep(4000);

        expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
        expect(await element(by.name('ErrorMessage')).getText()).toEqual(
         'Mechanographic Number is required'
     );
    });
    
    it('driver submit fail case 4, birth date is required ', async function() {
		await browser.get('http://localhost:4200/registrations/driver');
		await browser.waitForAngularEnabled(true);

        element(by.name('driverName')).sendKeys('DriverE2ETest1');
        element(by.name('driverMechNumber')).sendKeys('789789789');
        
        element(by.name('driverCitizenCardNumber')).sendKeys('00000000');
        element(by.name('driverFiscalNumber')).sendKeys('000000000');
        element(by.name('driverLicense')).sendKeys('P-00000000');
        element(by.name('DatePicker4')).sendKeys('01/01/2019');
        element(by.name('DatePicker')).sendKeys('01/01/2020');
        element(by.name('DatePicker2')).sendKeys('01/02/2020');
        element(by.name('type')).sendKeys('TESTE2ED1');
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

        await browser.sleep(200);

		element(by.name('form')).submit();
		await browser.sleep(4000);

        expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
        expect(await element(by.name('ErrorMessage')).getText()).toEqual(
         'Birth Date is required'
     );
    });
    
    it('driver submit fail case 5, citizen card is required ', async function() {
		await browser.get('http://localhost:4200/registrations/driver');
		await browser.waitForAngularEnabled(true);

        element(by.name('driverName')).sendKeys('DriverE2ETest1');
        element(by.name('driverMechNumber')).sendKeys('789789789');
        element(by.name('DatePicker3')).sendKeys('01/01/2000');
       
        element(by.name('driverFiscalNumber')).sendKeys('000000000');
        element(by.name('driverLicense')).sendKeys('P-00000000');
        element(by.name('DatePicker4')).sendKeys('01/01/2019');
        element(by.name('DatePicker')).sendKeys('01/01/2020');
        element(by.name('DatePicker2')).sendKeys('01/02/2020');
        element(by.name('type')).sendKeys('TESTE2ED1');
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

        await browser.sleep(200);

		element(by.name('form')).submit();
		await browser.sleep(4000);

        expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
        expect(await element(by.name('ErrorMessage')).getText()).toEqual(
         'Citizen Card Number is required'
     );
    });

    it('driver submit fail case 6, fiscal number is required ', async function() {

		await browser.get('http://localhost:4200/registrations/driver');
		await browser.waitForAngularEnabled(true);

		
        element(by.name('driverName')).sendKeys('DriverE2ETest1');
        element(by.name('driverMechNumber')).sendKeys('789789789');
        element(by.name('DatePicker3')).sendKeys('01/01/2000');
        element(by.name('driverCitizenCardNumber')).sendKeys('00000000');
        
        element(by.name('driverLicense')).sendKeys('P-00000000');
        element(by.name('DatePicker4')).sendKeys('01/01/2019');
        element(by.name('DatePicker')).sendKeys('01/01/2020');
        element(by.name('DatePicker2')).sendKeys('01/02/2020');
        element(by.name('type')).sendKeys('TESTE2ED1');
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

        await browser.sleep(200);

		element(by.name('form')).submit();
		await browser.sleep(4000);

        
            expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
            expect(await element(by.name('ErrorMessage')).getText()).toEqual(
		 	'Fiscal Number is required'
		 );
    });
    it('driver submit fail case 7, license is required ', async function() {

		await browser.get('http://localhost:4200/registrations/driver');
		await browser.waitForAngularEnabled(true);

		
        element(by.name('driverName')).sendKeys('DriverE2ETest1');
        element(by.name('driverMechNumber')).sendKeys('789789789');
        element(by.name('DatePicker3')).sendKeys('01/01/2000');
        element(by.name('driverCitizenCardNumber')).sendKeys('00000000');
        element(by.name('driverFiscalNumber')).sendKeys('000000000');
       
        element(by.name('DatePicker4')).sendKeys('01/01/2019');
        element(by.name('DatePicker')).sendKeys('01/01/2020');
        element(by.name('DatePicker2')).sendKeys('01/02/2020');
        element(by.name('type')).sendKeys('TESTE2ED1');
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

        await browser.sleep(200);

		element(by.name('form')).submit();
		await browser.sleep(4000);

        
            expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
            expect(await element(by.name('ErrorMessage')).getText()).toEqual(
		 	'License is required'
		 );
    });
    it('driver submit fail case 8, license date is required ', async function() {

		await browser.get('http://localhost:4200/registrations/driver');
		await browser.waitForAngularEnabled(true);

		
        element(by.name('driverName')).sendKeys('DriverE2ETest1');
        element(by.name('driverMechNumber')).sendKeys('789789789');
        element(by.name('DatePicker3')).sendKeys('01/01/2000');
        element(by.name('driverCitizenCardNumber')).sendKeys('00000000');
        element(by.name('driverFiscalNumber')).sendKeys('000000000');
        element(by.name('driverLicense')).sendKeys('P-00000000');
        
        element(by.name('DatePicker')).sendKeys('01/01/2020');
        element(by.name('DatePicker2')).sendKeys('01/02/2020');
        element(by.name('type')).sendKeys('TESTE2ED1');
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

        await browser.sleep(200);

		element(by.name('form')).submit();
		await browser.sleep(4000);

        
            expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
            expect(await element(by.name('ErrorMessage')).getText()).toEqual(
		 	'License date is required'
		 );
    });
    
    it('driver submit fail case 9, entry date is required ', async function() {

		await browser.get('http://localhost:4200/registrations/driver');
		await browser.waitForAngularEnabled(true);

		
        element(by.name('driverName')).sendKeys('DriverE2ETest1');
        element(by.name('driverMechNumber')).sendKeys('789789789');
        element(by.name('DatePicker3')).sendKeys('01/01/2000');
        element(by.name('driverCitizenCardNumber')).sendKeys('00000000');
        element(by.name('driverFiscalNumber')).sendKeys('000000000');
        element(by.name('driverLicense')).sendKeys('P-00000000');
        element(by.name('DatePicker4')).sendKeys('01/01/2019');
        
        element(by.name('DatePicker2')).sendKeys('01/02/2020');
        element(by.name('type')).sendKeys('TESTE2ED1');
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

        await browser.sleep(200);

		element(by.name('form')).submit();
		await browser.sleep(4000);

        
            expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
            expect(await element(by.name('ErrorMessage')).getText()).toEqual(
		 	'Entry date is required'
		 );
    });
    
    it('driver submit fail case 10, type is required ', async function() {

		await browser.get('http://localhost:4200/registrations/driver');
		await browser.waitForAngularEnabled(true);

		
        element(by.name('driverName')).sendKeys('DriverE2ETest1');
        element(by.name('driverMechNumber')).sendKeys('789789789');
        element(by.name('DatePicker3')).sendKeys('01/01/2000');
        element(by.name('driverCitizenCardNumber')).sendKeys('00000000');
        element(by.name('driverFiscalNumber')).sendKeys('000000000');
        element(by.name('driverLicense')).sendKeys('P-00000000');
        element(by.name('DatePicker4')).sendKeys('01/01/2019');
        element(by.name('DatePicker')).sendKeys('01/01/2020');
        element(by.name('DatePicker2')).sendKeys('01/02/2020');
        
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

        await browser.sleep(200);

		element(by.name('form')).submit();
		await browser.sleep(4000);

        
            expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
            expect(await element(by.name('ErrorMessage')).getText()).toEqual(
		 	'Type is required'
		 );
    });
    
    it('driver submit fail case 11, mech number format is invalid  ', async function() {

		await browser.get('http://localhost:4200/registrations/driver');
		await browser.waitForAngularEnabled(true);

		
        element(by.name('driverName')).sendKeys('DriverE2ETest1');
        element(by.name('driverMechNumber')).sendKeys('78978...');
        element(by.name('DatePicker3')).sendKeys('01/01/2000');
        element(by.name('driverCitizenCardNumber')).sendKeys('00000000');
        element(by.name('driverFiscalNumber')).sendKeys('000000000');
        element(by.name('driverLicense')).sendKeys('P-00000000');
        element(by.name('DatePicker4')).sendKeys('01/01/2019');
        element(by.name('DatePicker')).sendKeys('01/01/2020');
        element(by.name('DatePicker2')).sendKeys('01/02/2020');
        element(by.name('type')).sendKeys('TESTE2ED1');
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

        await browser.sleep(200);

		element(by.name('form')).submit();
		await browser.sleep(4000);

        
            expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
            expect(await element(by.name('ErrorMessage')).getText()).toEqual(
		 	'Mechanographic Number must be 9 characters long and alphanumeric'
		 );
	});

    it('driver submit fail case 12, invalid citizen card number ', async function() {
		await browser.get('http://localhost:4200/registrations/driver');
		await browser.waitForAngularEnabled(true);

		element(by.name('driverName')).sendKeys('DriverE2ETest1');
        element(by.name('driverMechNumber')).sendKeys('789789789');
        element(by.name('DatePicker3')).sendKeys('01/01/2000');
        element(by.name('driverCitizenCardNumber')).sendKeys('000000aa...');
        element(by.name('driverFiscalNumber')).sendKeys('000000000');
        element(by.name('driverLicense')).sendKeys('P-00000000');
        element(by.name('DatePicker4')).sendKeys('01/01/2019');
        element(by.name('DatePicker')).sendKeys('01/01/2020');
        element(by.name('DatePicker2')).sendKeys('01/02/2020');
        element(by.name('type')).sendKeys('TESTE2ED1');
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

        await browser.sleep(200);

		element(by.name('form')).submit();
	
		await browser.sleep(4000);

        
		//await browser.sleep(20000);
		 expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
		// //await browser.sleep(20000);
		expect(await element(by.name('ErrorMessage')).getText()).toEqual(
		 	'Citizen Card Number is in invalid format'
		 );

		//	expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(false);
	});

	it('driver submit fail case 13, invalid fiscal number  ', async function() {
		await browser.get('http://localhost:4200/registrations/driver');
		await browser.waitForAngularEnabled(true);

		element(by.name('driverName')).sendKeys('DriverE2ETest1');
        element(by.name('driverMechNumber')).sendKeys('789789789');
        element(by.name('DatePicker3')).sendKeys('01/01/2000');
        element(by.name('driverCitizenCardNumber')).sendKeys('00000000');
        element(by.name('driverFiscalNumber')).sendKeys('0000000...');
        element(by.name('driverLicense')).sendKeys('P-00000000');
        element(by.name('DatePicker4')).sendKeys('01/01/2019');
        element(by.name('DatePicker')).sendKeys('01/01/2020');
        element(by.name('DatePicker2')).sendKeys('01/02/2020');
        element(by.name('type')).sendKeys('TESTE2ED1');
		//await browser.sleep(10000);
		//element(by.name('buttonSubmit')).click();

        await browser.sleep(200);

		element(by.name('form')).submit();
	
		await browser.sleep(4000);

        expect(await element(by.name('ErrorMessage')).isDisplayed()).toBe(true);
        expect(await element(by.name('ErrorMessage')).getText()).toEqual(
         'Fiscal Number is in invalid format'
	 );
        });
        




});       