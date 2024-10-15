import { Driver } from "./Driver";

describe('Driver Model Test', () => {
	it('Should create Driver success case 1', () => {
		const expectedD = {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"
		};

        let createdDT= Driver.create(expectedD);
        
        expect(createdDT.mechanographicNumber).toEqual(expectedD.mechanographicNumber, fail);
        expect(createdDT.name).toEqual(expectedD.name, fail);
        expect(createdDT.birthDate).toEqual(expectedD.birthDate, fail);
        expect(createdDT.citizenCardNumber).toEqual(expectedD.citizenCardNumber, fail);
        expect(createdDT.entryDate).toEqual(expectedD.entryDate, fail);
        expect(createdDT.departureDate).toEqual(expectedD.departureDate, fail);
        expect(createdDT.fiscalNumber).toEqual(expectedD.fiscalNumber, fail);
        expect(createdDT.type).toEqual(expectedD.type, fail);

        expect(createdDT.license).toEqual(expectedD.license, fail);
        expect(createdDT.licenseDate).toEqual(expectedD.licenseDate, fail);
		
    });
    
    it('Should create Driver success case 2', () => {
		const expectedD = {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"
		};

        let createdDT= Driver.create(expectedD);
        
        expect(createdDT.mechanographicNumber).toEqual(expectedD.mechanographicNumber, fail);
        expect(createdDT.name).toEqual(expectedD.name, fail);
        expect(createdDT.birthDate).toEqual(expectedD.birthDate, fail);
        expect(createdDT.citizenCardNumber).toEqual(expectedD.citizenCardNumber, fail);
        expect(createdDT.entryDate).toEqual(expectedD.entryDate, fail);
       
        expect(createdDT.fiscalNumber).toEqual(expectedD.fiscalNumber, fail);
        expect(createdDT.type).toEqual(expectedD.type, fail);

        expect(createdDT.license).toEqual(expectedD.license, fail);
        expect(createdDT.licenseDate).toEqual(expectedD.licenseDate, fail);
		
	});
	
	it('Should create Driver fail case 1, name is required', () => {
		const expectedD = {
            mechanographicNumber: "123456789",
            
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"
		};


		try{
		let createdDT= Driver.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('Name is required',fail);
		}
	});
	
	it('Should create Driver fail case 2, mechanographic number is required', () => {
		const expectedD = {
            
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"
		};


		try{
		let createdDT= Driver.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('Mechanographic Number is required',fail);
		}
    });
    
    it('Should create Driver fail case 3, citizen card number is required', () => {
		const expectedD = {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: "02/20/2000",
           
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"
		};


		try{
		let createdDT= Driver.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('Citizen Card Number is required',fail);
		}
    });
    
    it('Should create Driver fail case 4, fiscal number is required', () => {
		const expectedD = {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
         
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"
		};


		try{
		let createdDT= Driver.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('Fiscal Number is required',fail);
		}
    });

    it('Should create Driver fail case 5, type is required', () => {
		const expectedD = {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            
            license:"X",
            licenseDate:"01/02/2020"
		};


		try{
		let createdDT= Driver.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('Type is required',fail);
		}
    });

    it('Should create Driver fail case 6, birth date is required', () => {
		const expectedD = {
            mechanographicNumber: "123456789",
            name: "string",
            
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"
		};


		try{
		let createdDT= Driver.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('Birth Date is required',fail);
		}
    });

    it('Should create Driver fail case 7, Entry date is required', () => {
		const expectedD = {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"
		};


		try{
		let createdDT= Driver.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('Entry date is required',fail);
		}
    });

    it('Should create Driver fail case 8, License is required', () => {
		const expectedD = {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            type:"type1",
           
            licenseDate:"01/02/2020"
		};


		try{
		let createdDT= Driver.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('License is required',fail);
		}
    });

    it('Should create Driver fail case 9, license date is required', () => {
		const expectedD = {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
           
		};

		try{
		let createdDT= Driver.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('License date is required',fail);
		}
    });

    

	

	it('Should create Driver fail case 10, mechanographic number is in invalid format', () => {
		const expectedD = {
            mechanographicNumber: "1234567890",
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"
		};


        try{
			let createdDT= Driver.create(expectedD);
			expect(1).toEqual(2);
			}catch(err){
				expect(err.message).toEqual('Mechanographic Number must be 9 characters long and alphanumeric',fail);
			}
		
	});

	it('Should create Driver fail case 11, citizen card is in invalid format', () => {
		const expectedD = {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "123456785",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "123456789",
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"
		};


        try{
			let createdDT= Driver.create(expectedD);
			expect(1).toEqual(2);
			}catch(err){
				expect(err.message).toEqual('Citizen Card Number is in invalid format',fail);
			}
		
    });

    it('Should create Driver fail case 12, fiscal number is in invalid format', () => {
		const expectedD = {
            mechanographicNumber: "123456789",
            name: "string",
            birthDate: "02/20/2000",
            citizenCardNumber: "12345678",
            entryDate: "01/01/2020",
            departureDate:"01/02/2020",
            fiscalNumber: "1234567890",
            type:"type1",
            license:"X",
            licenseDate:"01/02/2020"
		};


        try{
			let createdDT= Driver.create(expectedD);
			expect(1).toEqual(2);
			}catch(err){
				expect(err.message).toEqual('Fiscal Number is in invalid format',fail);
			}
		
    });
    
});  