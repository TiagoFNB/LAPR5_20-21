import { VehicleDuty } from "./VehicleDuty";



describe('VehicleDuty Model Test', () => {
	it('Should create VehicleDuty success case 1', () => {
		const expectedD = {
            code:"0123456789",
            vehicleLicense: "AA-01-AA",
           
		};

        let createdDT= VehicleDuty.create(expectedD);
		expect(createdDT.VehicleDutyCode).toEqual(expectedD.code, fail);
        expect(createdDT.VehicleLicense).toEqual(expectedD.vehicleLicense, fail);
        
	});
	
	it('Should create VehicleDuty fail case 1, vehicle is required', () => {
		const expectedD = {
            code:"0123456789",
           
           
		};


		try{
		let createdDT= VehicleDuty.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('Vehicle is required',fail);
		}
	});
	
	it('Should create VehicleDuty fail case 2, code is required', () => {
		const expectedD = {
           
            vehicleLicense: "AA-01-AA",
           
		};

		try{
		let createdDT= VehicleDuty.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('Code is required',fail);
		}
    });
    
    it('Should create VehicleDuty fail case 3, code is too long', () => {
		const expectedD = {
            code:"012345678900",
            vehicleLicense: "AA-01-AA",
           
		};
		try{
		let createdDT= VehicleDuty.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('Code must be 10 characters long',fail);
		}
    });

});  