import { DriverType } from "./DriverType";



describe('DriverType Model Test', () => {
	it('Should create DriverType success case 1', () => {
		const expectedD = {
			name: 'name1',
			description: 'desc1',

		};

        let createdDT= DriverType.create(expectedD)
		expect(createdDT.name).toEqual(expectedD.name, fail);
		expect(createdDT.description).toEqual(expectedD.description, fail);
		
	});
	
	it('Should create DriverType fail case 1, name is required', () => {
		const expectedD = {
			
			description: 'desc1'

		};

		try{
		let createdDT= DriverType.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('Name is required',fail);
		}
	});
	
	it('Should create DriverType fail case 2, description is required', () => {
		const expectedD = {
			name:"name1"
			

		};

		try{
		let createdDT= DriverType.create(expectedD);
		expect(1).toEqual(2);
		}catch(err){
			expect(err.message).toEqual('Description is required',fail);
		}
	});
	

	it('Should create DriverType fail case 3, name is longer than 20', () => {
		const expectedD = {
			name: '1'.repeat(21),
			description: 'desc1',

		};

        try{
			let createdDT= DriverType.create(expectedD);
			expect(1).toEqual(2);
			}catch(err){
				expect(err.message).toEqual('Name is too long',fail);
			}
		
	});

	it('Should create DriverType fail case 3, desc is longer than 250', () => {
		const expectedD = {
			name: 'name1',
			description: '1'.repeat(251),

		};

        try{
			let createdDT= DriverType.create(expectedD);
			expect(1).toEqual(2);
			}catch(err){
				expect(err.message).toEqual('Description is too long',fail);
			}
		
	});
    
    











    
});    