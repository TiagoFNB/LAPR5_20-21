import { VehicleType } from '../../../../VehicleType/domain/VehicleType';
describe('testing vehicle type domain class', () => {
	test('it should create a vehicle type sucessfully (case 1)', async () => {
		//shall create a vehicletype sucessfully

		const object = {
			key: 'key1',
			name: 'vh11111111',
			autonomy: '10',
			fuelType: 'gpl',
			costPerKm: 2,
			averageSpeed: 40,
			averageConsumption: 10,
			currency: 'USD',
			description: 'desc1'
		};
		let vehicletype: VehicleType;
		await VehicleType.create(object).then((result) => {
			vehicletype = result;
		});
		expect(vehicletype.key).toBe('key1');
		expect(vehicletype.name.name).toBe('vh11111111');
		expect(vehicletype.autonomy.autonomy).toBe('10');
		expect(vehicletype.fuelType.type).toBe('gpl');
		expect(vehicletype.costPerKm.costPerKm).toBe(2);
		expect(vehicletype.averageSpeed.avgSpeed).toBe(40);
		expect(vehicletype.averageConsumption.averageConsumption).toBe(10); // becouse the node is depot, it is also a relief point even if send it as false
		expect(vehicletype.costPerKm.currency).toBe('USD');
		expect(vehicletype.description.desc).toBe('desc1');
	});

	test('it should create a vehicle type sucessfully (case 2)', async () => {
		//currency is not defined, it should default to EUR and shall create a vehicletype sucessfully

		const object = {
			key: 'key1',
			name: 'vh11111111',
			autonomy: '10',
			fuelType: 'diesel',
			costPerKm: 2,
			averageSpeed: 40,
			averageConsumption: 10,
			description: 'desc1'
		};
		let vehicletype: VehicleType;
		await VehicleType.create(object).then((result) => {
			vehicletype = result;
		});
		expect(vehicletype.key).toBe('key1');
		expect(vehicletype.name.name).toBe('vh11111111');
		expect(vehicletype.autonomy.autonomy).toBe('10');
		expect(vehicletype.fuelType.type).toBe('diesel');
		expect(vehicletype.costPerKm.costPerKm).toBe(2);
		expect(vehicletype.averageSpeed.avgSpeed).toBe(40);
		expect(vehicletype.averageConsumption.averageConsumption).toBe(10); // becouse the node is depot, it is also a relief point even if send it as false
		expect(vehicletype.costPerKm.currency).toBe('EUR');
		expect(vehicletype.description.desc).toBe('desc1');
	});

	test('it should create a vehicle type sucessfully (case 3)', async () => {
		//key is not defined

		const object = {
			name: 'vh11111111',
			autonomy: '10',
			fuelType: 'gpl',
			costPerKm: 2,
			averageSpeed: 40,
			averageConsumption: 10,
			description: 'desc1'
		};
		let vehicletype: VehicleType;
		await VehicleType.create(object).then((result) => {
			vehicletype = result;
		});
		expect(vehicletype.key).toBeUndefined();
		expect(vehicletype.name.name).toBe('vh11111111');
		expect(vehicletype.autonomy.autonomy).toBe('10');
		expect(vehicletype.fuelType.type).toBe('gpl');
		expect(vehicletype.costPerKm.costPerKm).toBe(2);
		expect(vehicletype.averageSpeed.avgSpeed).toBe(40);
		expect(vehicletype.averageConsumption.averageConsumption).toBe(10); // becouse the node is depot, it is also a relief point even if send it as false
		expect(vehicletype.costPerKm.currency).toBe('EUR');
		expect(vehicletype.description.desc).toBe('desc1');
	});

	test('it should create a vehicle type sucessfully (case 4)', async () => {
		//fuelType is in code format

		const object = {
			name: 'vh11111111',
			autonomy: '10',
			fuelType: '1',
			costPerKm: 2,
			averageSpeed: 40,
			averageConsumption: 10,
			description: 'desc1'
		};
		let vehicletype: VehicleType;
		await VehicleType.create(object).then((result) => {
			vehicletype = result;
		});
		expect(vehicletype.key).toBeUndefined();
		expect(vehicletype.name.name).toBe('vh11111111');
		expect(vehicletype.autonomy.autonomy).toBe('10');
		expect(vehicletype.fuelType.type).toBe('gasoline');
		expect(vehicletype.costPerKm.costPerKm).toBe(2);
		expect(vehicletype.averageSpeed.avgSpeed).toBe(40);
		expect(vehicletype.averageConsumption.averageConsumption).toBe(10); // becouse the node is depot, it is also a relief point even if send it as false
		expect(vehicletype.costPerKm.currency).toBe('EUR');
		expect(vehicletype.description.desc).toBe('desc1');
	});

	test('it should create a vehicle type sucessfully (case 5)', async () => {
		//fuelType is in code format

		const object = {
			name: 'vh11111111',
			autonomy: '10',
			fuelType: '23',
			costPerKm: 2,
			averageSpeed: 40,
			averageConsumption: 10,
			description: 'desc1'
		};
		let vehicletype: VehicleType;
		await VehicleType.create(object).then((result) => {
			vehicletype = result;
		});
		expect(vehicletype.key).toBeUndefined();
		expect(vehicletype.name.name).toBe('vh11111111');
		expect(vehicletype.autonomy.autonomy).toBe('10');
		expect(vehicletype.fuelType.type).toBe('diesel');
		expect(vehicletype.costPerKm.costPerKm).toBe(2);
		expect(vehicletype.averageSpeed.avgSpeed).toBe(40);
		expect(vehicletype.averageConsumption.averageConsumption).toBe(10); // becouse the node is depot, it is also a relief point even if send it as false
		expect(vehicletype.costPerKm.currency).toBe('EUR');
		expect(vehicletype.description.desc).toBe('desc1');
	});

	test('it should create a vehicle type sucessfully (case 6)', async () => {
		//fuelType is in code format

		const object = {
			name: 'vh11111111',
			autonomy: '10',
			fuelType: '20',
			costPerKm: 2,
			averageSpeed: 40,
			averageConsumption: 10,
			description: 'desc1'
		};
		let vehicletype: VehicleType;
		await VehicleType.create(object).then((result) => {
			vehicletype = result;
		});
		expect(vehicletype.key).toBeUndefined();
		expect(vehicletype.name.name).toBe('vh11111111');
		expect(vehicletype.autonomy.autonomy).toBe('10');
		expect(vehicletype.fuelType.type).toBe('gpl');
		expect(vehicletype.costPerKm.costPerKm).toBe(2);
		expect(vehicletype.averageSpeed.avgSpeed).toBe(40);
		expect(vehicletype.averageConsumption.averageConsumption).toBe(10); // becouse the node is depot, it is also a relief point even if send it as false
		expect(vehicletype.costPerKm.currency).toBe('EUR');
		expect(vehicletype.description.desc).toBe('desc1');
	});

	test('it should create a vehicle type sucessfully (case 7)', async () => {
		//fuelType is in code format

		const object = {
			name: 'vh11111111',
			autonomy: '10',
			fuelType: '50',
			costPerKm: 2,
			averageSpeed: 40,
			averageConsumption: 10,
			description: 'desc1'
		};
		let vehicletype: VehicleType;
		await VehicleType.create(object).then((result) => {
			vehicletype = result;
		});
		expect(vehicletype.key).toBeUndefined();
		expect(vehicletype.name.name).toBe('vh11111111');
		expect(vehicletype.autonomy.autonomy).toBe('10');
		expect(vehicletype.fuelType.type).toBe('hydrogen');
		expect(vehicletype.costPerKm.costPerKm).toBe(2);
		expect(vehicletype.averageSpeed.avgSpeed).toBe(40);
		expect(vehicletype.averageConsumption.averageConsumption).toBe(10); // becouse the node is depot, it is also a relief point even if send it as false
		expect(vehicletype.costPerKm.currency).toBe('EUR');
		expect(vehicletype.description.desc).toBe('desc1');
	});
	test('it should create a vehicle type sucessfully (case 8)', async () => {
		//fuelType is in code format

		const object = {
			name: 'vh11111111',
			autonomy: '10',
			fuelType: '75',
			costPerKm: 2,
			averageSpeed: 40,
			averageConsumption: 10,
			description: 'desc1'
		};
		let vehicletype: VehicleType;
		await VehicleType.create(object).then((result) => {
			vehicletype = result;
		});
		expect(vehicletype.key).toBeUndefined();
		expect(vehicletype.name.name).toBe('vh11111111');
		expect(vehicletype.autonomy.autonomy).toBe('10');
		expect(vehicletype.fuelType.type).toBe('electric');
		expect(vehicletype.costPerKm.costPerKm).toBe(2);
		expect(vehicletype.averageSpeed.avgSpeed).toBe(40);
		expect(vehicletype.averageConsumption.averageConsumption).toBe(10); // becouse the node is depot, it is also a relief point even if send it as false
		expect(vehicletype.costPerKm.currency).toBe('EUR');
		expect(vehicletype.description.desc).toBe('desc1');
	});
	test('it should Not create a vehicle type sucessfully (error case 1)', async () => {
		//cost per km is not positive

		const object = {
			key: 'key1',
			name: 'vh11111111',
			autonomy: '10',
			fuelType: 'gas',
			costPerKm: -1,
			averageSpeed: 40,
			averageConsumption: 10,
			description: 'desc1'
		};
		let err;
		await VehicleType.create(object).catch((error) => {
			err = error.message;
		});
		expect(err).toBeDefined();
	});

	test('it should Not create a vehicle type sucessfully (error case 2)', async () => {
		//averageSpeed  is not positive

		const object = {
			key: 'key1',
			name: 'vh11111111',
			autonomy: '10',
			fuelType: 'gas',
			costPerKm: 10,
			averageSpeed: -40,
			averageConsumption: 10,
			description: 'desc1'
		};
		let err;
		await VehicleType.create(object).catch((error) => {
			err = error.message;
		});
		expect(err).toBeDefined();
	});

	test('it should Not create a vehicle type sucessfully (error case 3)', async () => {
		//averageConsumption  is not positive

		const object = {
			key: 'key1',
			name: 'vh11111111',
			autonomy: '10',
			fuelType: 'gas',
			costPerKm: 10,
			averageSpeed: 40,
			averageConsumption: -1,
			description: 'desc1'
		};
		let err;
		await VehicleType.create(object).catch((error) => {
			err = error.message;
		});
		expect(err).toBeDefined();
	});

	test('it should Not create a vehicle type sucessfully (error case 4)', async () => {
		//description  is not defined

		const object = {
			key: 'key1',
			name: 'vh11111111',
			autonomy: '10',
			fuelType: 'gas',
			costPerKm: 10,
			averageSpeed: 40,
			averageConsumption: 10
		};
		let err;
		await VehicleType.create(object).catch((error) => {
			err = error.message;
		});
		expect(err).toBeDefined();
	});

	test('it should Not create a vehicle type sucessfully (error case 5)', async () => {
		//fuel type  is not defined

		const object = {
			key: 'key1',
			name: 'vh11111111',
			autonomy: '10',
			costPerKm: 10,
			averageSpeed: 40,
			averageConsumption: 10,
			description: 'desc1'
		};
		let err;
		await VehicleType.create(object).catch((error) => {
			err = error.message;
		});
		expect(err).toBeDefined();
	});

	test('it should Not create a vehicle type sucessfully (error case 6)', async () => {
		//autonomy  is not defined

		const object = {
			key: 'key1',
			name: 'vh11111111',
			fuelType: 'gas',
			costPerKm: 10,
			averageSpeed: 40,
			averageConsumption: -1,
			description: 'desc1'
		};
		let err;
		await VehicleType.create(object).catch((error) => {
			err = error.message;
		});
		expect(err).toBeDefined();
	});

	test('it should Not create a vehicle type sucessfully (error case 7)', async () => {
		//name  is not defined

		const object = {
			key: 'key1',

			autonomy: '10',
			fuelType: 'gas',
			costPerKm: 10,
			averageSpeed: 40,
			averageConsumption: -1,
			description: 'desc1'
		};
		let err;
		await VehicleType.create(object).catch((error) => {
			err = error.message;
		});
		expect(err).toBeDefined();
	});

	test('it should Not create a vehicle type sucessfully (error case 8)', async () => {
		//fueltype is not  of a valid type

		const object = {
			key: 'key1',
			name: 'vh11111111',
			autonomy: '10',
			fuelType: 'invalid type',
			costPerKm: 10,
			averageSpeed: 40,
			averageConsumption: -1,
			description: 'desc1'
		};
		let err;
		await VehicleType.create(object).catch((error) => {
			err = error.message;
		});
		expect(err).toBeDefined();
	});

	test('it should Not create a vehicle type sucessfully (error case 9)', async () => {
		//currency is not  of a valid type

		const object = {
			name: 'vh11111111',
			autonomy: '10',
			fuelType: 'gas',
			costPerKm: 10,
			averageSpeed: 40,
			averageConsumption: -1,
			description: 'desc1',
			currency: 'invalidCurrency'
		};
		let err;
		await VehicleType.create(object).catch((error) => {
			err = error.message;
		});

		expect(err).toBeDefined();
	});
});
