import { Vehicle } from "./Vehicle";



describe('Vehicle Model Test', () => {
	it('Should create Vehicle success case 1', () => {
		const expectedD = {
            license:"AA-01-AA",
            vin: "12345678901234567",
            entryDateOfService:"2015/12/25",
            type: "VehicleTypeTT"
		};

        let createdDT= Vehicle.create(expectedD);
		expect(createdDT.license).toEqual(expectedD.license, fail);
        expect(createdDT.vin).toEqual(expectedD.vin, fail);
        expect(createdDT.type).toEqual(expectedD.type, fail);
        expect(createdDT.entryDateOfService).toEqual(expectedD.entryDateOfService, fail);
		
	});
	
	it('Should create Vehicle fail case 1, license is required', () => {
		const expectedD = {
            
            vin: "12345678901234567",
            entryDateOfService:"2015/12/25",
            type: "VehicleTypeTT"
		};

		try{
		let createdDT= Vehicle.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('License is required',fail);
		}
	});
	
	it('Should create Vehicle fail case 2, vin is required', () => {
		const expectedD = {
            license:"AA-01-AA",
           
            entryDateOfService:"2015/12/25",
            type: "VehicleTypeTT"
		};

		try{
		let createdDT= Vehicle.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('Vin is required',fail);
		}
    });
    
    it('Should create Vehicle fail case 3, entryDate is required', () => {
		const expectedD = {
            license:"AA-01-AA",
            vin: "12345678901234567",
           
            type: "VehicleTypeTT"
		};

		try{
		let createdDT= Vehicle.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('Entry date of service is required',fail);
		}
    });
    
    it('Should create Vehicle fail case 4, type is required', () => {
		const expectedD = {
            license:"AA-01-AA",
            vin: "12345678901234567",
            entryDateOfService:"2015/12/25"
           
		};

		try{
		let createdDT= Vehicle.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('Type is required',fail);
		}
    });
    

	

	it('Should create Vehicle fail case 5, License is in invalid format', () => {
		const expectedD = {
			license: '1'.repeat(21),
            vin: "12345678901234567",
            entryDateOfService:"2015/12/25",
            type: "VehicleTypeTT"
		};

        try{
			let createdDT= Vehicle.create(expectedD);
			expect(1).toEqual(2);
			}catch(err){
				expect(err.message).toEqual('License is in invalid format',fail);
			}
		
	});

	it('Should create Vehicle fail case 6, vin is not 17 chars', () => {
		const expectedD = {
            license:"AA-01-AA",
            vin: "123456789012345675",
            entryDateOfService:"2015/12/25",
            type: "VehicleTypeTT"
		};

        try{
			let createdDT= Vehicle.create(expectedD);
			expect(1).toEqual(2);
			}catch(err){
				expect(err.message).toEqual('Vin must be 17 characters long and alphanumeric',fail);
			}
		
    });

    it('Should create Vehicle fail case 6, vin is not alphanumeric', () => {
		const expectedD = {
            license:"AA-01-AA",
            vin: "1234567890123_456",
            entryDateOfService:"2015/12/25",
            type: "VehicleTypeTT"
		};

        try{
			let createdDT= Vehicle.create(expectedD);
			expect(1).toEqual(2);
			}catch(err){
				expect(err.message).toEqual('Vin must be 17 characters long and alphanumeric',fail);
			}
		
    });
    











});  