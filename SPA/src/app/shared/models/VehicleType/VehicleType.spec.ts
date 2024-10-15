import { VehicleTypeInterface } from 'src/app/shared/models/VehicleType/VehicleTypeInterface';
import { VehicleType } from 'src/app/shared/models/VehicleType/VehicleType';

describe('Vehicle type Model test', () => {
	it('Should create vehicle type success case 1', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'nam1',
			description: 'shortName1',
			costPerKm: 40,
			autonomy: 45,
			averageConsumption: 40,
			averageSpeed: 30,
			currency: 'EUR',
			fuelType: 'gpl'
		};
		const createdvt = VehicleType.create(expectedV);

		expect(createdvt.name).toEqual(expectedV.name, fail);
		expect(createdvt.description).toEqual(expectedV.description, fail);
		expect(createdvt.costPerKm).toEqual(expectedV.costPerKm, fail);
		expect(createdvt.autonomy).toEqual(expectedV.autonomy, fail);
		expect(createdvt.averageConsumption).toEqual(expectedV.averageConsumption, fail);
		expect(createdvt.averageSpeed).toEqual(expectedV.averageSpeed, fail);
		expect(createdvt.currency).toEqual(expectedV.currency, fail);
		expect(createdvt.fuelType).toEqual(expectedV.fuelType, fail);
	});

	it('Should create Node  success case 2 (only required fields are specified)', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'nam1',
			costPerKm: 40,
			autonomy: 45,
			averageConsumption: 40,
			averageSpeed: 30,
			fuelType: 'gpl'
		};
		const createdvt = VehicleType.create(expectedV);

		expect(createdvt.name).toEqual(expectedV.name, fail);
		expect(createdvt.description).toBeUndefined();
		expect(createdvt.costPerKm).toEqual(expectedV.costPerKm, fail);
		expect(createdvt.autonomy).toEqual(expectedV.autonomy, fail);
		expect(createdvt.averageConsumption).toEqual(expectedV.averageConsumption, fail);
		expect(createdvt.averageSpeed).toEqual(expectedV.averageSpeed, fail);
		expect(createdvt.currency).toEqual('EUR');
		expect(createdvt.fuelType).toEqual(expectedV.fuelType, fail);
	});

	it('Should create Node  success case 3 (fuel type is gasoline)', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'nam1',
			costPerKm: 40,
			autonomy: 45,
			averageConsumption: 40,
			averageSpeed: 30,
			fuelType: 'gasoline'
		};
		const createdvt = VehicleType.create(expectedV);

		expect(createdvt.name).toEqual(expectedV.name, fail);
		expect(createdvt.description).toBeUndefined();
		expect(createdvt.costPerKm).toEqual(expectedV.costPerKm, fail);
		expect(createdvt.autonomy).toEqual(expectedV.autonomy, fail);
		expect(createdvt.averageConsumption).toEqual(expectedV.averageConsumption, fail);
		expect(createdvt.averageSpeed).toEqual(expectedV.averageSpeed, fail);
		expect(createdvt.currency).toEqual('EUR');
		expect(createdvt.fuelType).toEqual(expectedV.fuelType, fail);
	});

	it('Should create Node  success case 3 (fuel type is diesel)', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'nam1',
			costPerKm: 40,
			autonomy: 45,
			averageConsumption: 40,
			averageSpeed: 30,
			fuelType: 'diesel'
		};
		const createdvt = VehicleType.create(expectedV);

		expect(createdvt.name).toEqual(expectedV.name, fail);
		expect(createdvt.description).toBeUndefined();
		expect(createdvt.costPerKm).toEqual(expectedV.costPerKm, fail);
		expect(createdvt.autonomy).toEqual(expectedV.autonomy, fail);
		expect(createdvt.averageConsumption).toEqual(expectedV.averageConsumption, fail);
		expect(createdvt.averageSpeed).toEqual(expectedV.averageSpeed, fail);
		expect(createdvt.currency).toEqual('EUR');
		expect(createdvt.fuelType).toEqual(expectedV.fuelType, fail);
	});

	it('Should create Node  success case 3 (fuel type is electric)', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'nam1',
			costPerKm: 40,
			autonomy: 45,
			averageConsumption: 40,
			averageSpeed: 30,
			fuelType: 'electric'
		};
		const createdvt = VehicleType.create(expectedV);

		expect(createdvt.name).toEqual(expectedV.name, fail);
		expect(createdvt.description).toBeUndefined();
		expect(createdvt.costPerKm).toEqual(expectedV.costPerKm, fail);
		expect(createdvt.autonomy).toEqual(expectedV.autonomy, fail);
		expect(createdvt.averageConsumption).toEqual(expectedV.averageConsumption, fail);
		expect(createdvt.averageSpeed).toEqual(expectedV.averageSpeed, fail);
		expect(createdvt.currency).toEqual('EUR');
		expect(createdvt.fuelType).toEqual(expectedV.fuelType, fail);
	});
	it('Should create Node  success case 4 (fuel type is hydrogen)', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'nam1',
			costPerKm: 40,
			autonomy: 45,
			averageConsumption: 40,
			averageSpeed: 30,
			fuelType: 'hydrogen'
		};
		const createdvt = VehicleType.create(expectedV);

		expect(createdvt.name).toEqual(expectedV.name, fail);
		expect(createdvt.description).toBeUndefined();
		expect(createdvt.costPerKm).toEqual(expectedV.costPerKm, fail);
		expect(createdvt.autonomy).toEqual(expectedV.autonomy, fail);
		expect(createdvt.averageConsumption).toEqual(expectedV.averageConsumption, fail);
		expect(createdvt.averageSpeed).toEqual(expectedV.averageSpeed, fail);
		expect(createdvt.currency).toEqual('EUR');
		expect(createdvt.fuelType).toEqual(expectedV.fuelType, fail);
	});

	it('Should create Node  error case 1 (name is invalid)', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'n',
			costPerKm: 40,
			autonomy: 45,
			averageConsumption: 40,
			averageSpeed: 30,
			fuelType: 'gpl'
		};

		let expError: boolean = false;
		try {
			const createdvt = VehicleType.create(expectedV);
			expect(true).toBe(false); // fail if it reaches here
		} catch (err) {
			expError = true;
		}
		expect(expError).toBe(true);
	});

	it('Should create Node  error case 1 (name is undefined)', () => {
		const expectedV: VehicleTypeInterface = {
			name: undefined,
			costPerKm: 40,
			autonomy: 45,
			averageConsumption: 40,
			averageSpeed: 30,
			fuelType: 'gpl'
		};

		let expError: boolean = false;
		try {
			const createdvt = VehicleType.create(expectedV);
			expect(true).toBe(false); // fail if it reaches here
		} catch (err) {
			expError = true;
		}
		expect(expError).toBe(true);
	});

	it('Should create Node  error case 2 (cost per km is invalid)', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'n1',
			costPerKm: 0.001,
			autonomy: 45,
			averageConsumption: 40,
			averageSpeed: 30,
			fuelType: 'gpl'
		};

		let expError: boolean = false;
		try {
			const createdvt = VehicleType.create(expectedV);
			expect(true).toBe(false); // fail if it reaches here
		} catch (err) {
			expError = true;
		}
		expect(expError).toBe(true);
	});

	it('Should create Node  error case 2 (cost per km is undefined)', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'n1',
			costPerKm: undefined,
			autonomy: 45,
			averageConsumption: 40,
			averageSpeed: 30,
			fuelType: 'gpl'
		};

		let expError: boolean = false;
		try {
			const createdvt = VehicleType.create(expectedV);
			expect(true).toBe(false); // fail if it reaches here
		} catch (err) {
			expError = true;
		}
		expect(expError).toBe(true);
	});

	it('Should create Node  error case 3 (autonomy invalid)', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'n1',
			costPerKm: 2,
			autonomy: 0.001,
			averageConsumption: 40,
			averageSpeed: 30,
			fuelType: 'gpl'
		};

		let expError: boolean = false;
		try {
			const createdvt = VehicleType.create(expectedV);
			expect(true).toBe(false); // fail if it reaches here
		} catch (err) {
			expError = true;
		}
		expect(expError).toBe(true);
	});

	it('Should create Node  error case 3 (autonomy is undefined)', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'n1',
			costPerKm: 2,
			autonomy: undefined,
			averageConsumption: 40,
			averageSpeed: 30,
			fuelType: 'gpl'
		};

		let expError: boolean = false;
		try {
			const createdvt = VehicleType.create(expectedV);
			expect(true).toBe(false); // fail if it reaches here
		} catch (err) {
			expError = true;
		}
		expect(expError).toBe(true);
	});

	it('Should create Node  error case 4 (averageConsumption invalid)', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'n1',
			costPerKm: 2,
			autonomy: 0.1,
			averageConsumption: 0.001,
			averageSpeed: 30,
			fuelType: 'gpl'
		};

		let expError: boolean = false;
		try {
			const createdvt = VehicleType.create(expectedV);
			expect(true).toBe(false); // fail if it reaches here
		} catch (err) {
			expError = true;
		}
		expect(expError).toBe(true);
	});

	it('Should create Node  error case 4 (averageConsumption is undefined)', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'n1',
			costPerKm: 2,
			autonomy: 0.1,
			averageConsumption: undefined,
			averageSpeed: 30,
			fuelType: 'gpl'
		};

		let expError: boolean = false;
		try {
			const createdvt = VehicleType.create(expectedV);
			expect(true).toBe(false); // fail if it reaches here
		} catch (err) {
			expError = true;
		}
		expect(expError).toBe(true);
	});

	it('Should create Node  error case 5 (averageSpeed invalid)', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'n1',
			costPerKm: 2,
			autonomy: 0.1,
			averageConsumption: 2,
			averageSpeed: 0,
			fuelType: 'gpl'
		};

		let expError: boolean = false;
		try {
			const createdvt = VehicleType.create(expectedV);
			expect(true).toBe(false); // fail if it reaches here
		} catch (err) {
			expError = true;
		}
		expect(expError).toBe(true);
	});

	it('Should create Node  error case 5 (averageSpeed is undefined)', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'n1',
			costPerKm: 2,
			autonomy: 0.1,
			averageConsumption: 2,
			averageSpeed: undefined,
			fuelType: 'gpl'
		};

		let expError: boolean = false;
		try {
			const createdvt = VehicleType.create(expectedV);
			expect(true).toBe(false); // fail if it reaches here
		} catch (err) {
			expError = true;
		}
		expect(expError).toBe(true);
	});

	it('Should create Node  error case 5 (fuelType invalid)', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'n1',
			costPerKm: 2,
			autonomy: 0.1,
			averageConsumption: 2,
			averageSpeed: 2,
			fuelType: 'invalid type'
		};

		let expError: boolean = false;
		try {
			const createdvt = VehicleType.create(expectedV);
			expect(true).toBe(false); // fail if it reaches here
		} catch (err) {
			expError = true;
		}
		expect(expError).toBe(true);
	});

	it('Should create Node  error case 5 (fuelType is undefined)', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'n1',
			costPerKm: 2,
			autonomy: 0.1,
			averageConsumption: 2,
			averageSpeed: 2,
			fuelType: undefined
		};

		let expError: boolean = false;
		try {
			const createdvt = VehicleType.create(expectedV);
			expect(true).toBe(false); // fail if it reaches here
		} catch (err) {
			expError = true;
		}
		expect(expError).toBe(true);
	});

	it('Should create Node  error case 6 (description has more then 250 chars )', () => {
		//creates a big string for description
		let x = 'desc';
		var iterations = 4;
		for (var i = 0; i < iterations; i++) {
			x += x + x;
		}

		//
		const expectedV: VehicleTypeInterface = {
			name: 'n1',
			costPerKm: 2,
			autonomy: 0.1,
			averageConsumption: 2,
			averageSpeed: 2,
			fuelType: 'gpl',
			description: x
		};

		let expError: boolean = false;
		try {
			const createdvt = VehicleType.create(expectedV);
			expect(true).toBe(false); // fail if it reaches here
		} catch (err) {
			expError = true;
		}
		expect(expError).toBe(true);
	});

	it('Should create Node  error case 6 (specified currency is not supported )', () => {
		//
		const expectedV: VehicleTypeInterface = {
			name: 'n1',
			costPerKm: 2,
			autonomy: 0.1,
			averageConsumption: 2,
			averageSpeed: 2,
			fuelType: 'gpl',
			currency: 'Uns'
		};

		let expError: boolean = false;
		try {
			const createdvt = VehicleType.create(expectedV);
			expect(true).toBe(false); // fail if it reaches here
		} catch (err) {
			expError = true;
		}
		expect(expError).toBe(true);
	});
});
