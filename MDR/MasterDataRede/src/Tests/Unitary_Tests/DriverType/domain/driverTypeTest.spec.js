import e from 'express';
import { DriverType } from '../../../../DriverType/domain/DriverType';
describe('Filter function', () => {
	test('it should create a drivertype sucessfully', async () => {
		
		const obj = {
		key: 'key1',
		name: 'name1',
		description : 'desc'};
		let newDT;
		await DriverType.create(obj).then(result =>{
			newDT=result
		});

		 

		expect(newDT.key).toBe('key1');
		expect(newDT.name.name).toBe('name1');
		expect(newDT.description).toBe('desc');
	});

	test('it should create a drivertype sucessfully but without key', async() => {
		const obj = {
			name: 'name1',
			description : 'desc'};
			let newDT;
			await DriverType.create(obj).then(result =>{
				newDT=result
			});
	
			 
	
			expect(newDT.key).toBe(undefined);
			expect(newDT.name.name).toBe('name1');
			expect(newDT.description).toBe('desc');
	});

	test('it should not create a drivertype sucessfully ,name is bigger than 20 chars', async() => {
		const obj = {
			name: 'name1name2name3name4name5',
			description : 'desc'};
			let newDT,error;
			await DriverType.create(obj).catch((e)=>{
				error=e;
				//console.log(e);
			});
			
			expect(error.message).toBeDefined();
	});

	test('it should not create a drivertype sucessfully ,name is required', async() => {
		const obj = {
			description : 'desc'};
			let newDT,error;
			await DriverType.create(obj).catch((e)=>{
				error=e;
				//console.log(e);
			});
			
			expect(error.message).toBeDefined();
	});

	test('it should not create a drivertype sucessfully ,desc is required', async() => {
		const obj = {
			name: 'name1',

			};
			let newDT,error;
			await DriverType.create(obj).catch((e)=>{
				error=e;
				//console.log(e);
			});
			
			expect(error.message).toBeDefined();
	});

	test('it should not create a drivertype sucessfully ,desc is longer than 250', async() => {
		const obj = {
			name: 'name1',
			description: '#'.repeat(300)
			};
			let newDT,error;
			await DriverType.create(obj).catch((e)=>{
				error=e;
				//console.log(e);
			});
			
			expect(error.message).toBeDefined();
	});

	test('it should not create a drivertype sucessfully ,desc is less than 3', async() => {
		const obj = {
			name: 'name1',
			description: '#'
			};
			let newDT,error;
			await DriverType.create(obj).catch((e)=>{
				error=e;
				//console.log(e);
			});
			
			expect(error.message).toBeDefined();
	});
	
});