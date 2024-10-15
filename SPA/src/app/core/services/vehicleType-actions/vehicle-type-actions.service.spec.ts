import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { VehicleType } from 'src/app/shared/models/VehicleType/VehicleType';
import { VehicleTypeInterface } from 'src/app/shared/models/VehicleType/VehicleTypeInterface';
import { VehicleTypeActionsService } from './vehicle-type-actions.service';

let httpClientSpy: { get: jasmine.Spy; post: jasmine.Spy };
let VTservice: VehicleTypeActionsService;

describe('VehicleTypeActionsService', () => {
	beforeEach(() => {
		// TODO: spy on other methods too

		httpClientSpy = jasmine.createSpyObj('HttpClient', [ 'get', 'post' ]);
		VTservice = new VehicleTypeActionsService(httpClientSpy as any);
	});

	it('should be created', () => {
		expect(VTservice).toBeTruthy();
	});

	it('Should get vehicleTypeList using http request', () => {
		const expectedVTs: any[] = [ { name: 'A', description: 'A' }, { name: 'B', description: 'B' } ];

		httpClientSpy.get.and.returnValue(of(expectedVTs));

		VTservice.getVehicleTypes().subscribe(
			(heroes) => expect(heroes).toEqual(expectedVTs, 'expected vehicle types'),
			fail
		);
	});

	it('should return an error when the server returns a 404', () => {
		const errorResponse = new HttpErrorResponse({
			error: 'test 404 error',
			status: 404,
			statusText: 'Not Found'
		});

		httpClientSpy.get.and.returnValue(throwError(errorResponse));

		VTservice.getVehicleTypes().subscribe(
			(vts) => fail('expected an error, not vehicles types'),
			(error) => expect(error.message).toContain('Not Found')
		);
	});

	it('Should create vehicleType using http request', () => {
		const expectedV: VehicleTypeInterface = {
			name: 'nam1',
			description: 'shortName1',
			costPerKm: 40,
			autonomy: 45,
			averageConsumption: 40,
			averageSpeed: 30,
			currency: 'EUR',
			fuelType: 'gas'
		};

		let x = spyOn(VehicleType, 'create').and.returnValue(expectedV);

		httpClientSpy.post.and.returnValue(of(expectedV));

		VTservice.registerVehicleType(expectedV).subscribe(
			(vt) => expect(vt).toEqual(expectedV, 'vehicle types'),
			fail
		);
	});

	it('Should Not create vehicleType becouse of http request', () => {
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

		let x = spyOn(VehicleType, 'create').and.returnValue(expectedV);

		httpClientSpy.post.and.returnValue(throwError({ error: 'http request failed' }));

		VTservice.registerVehicleType(expectedV).subscribe(
			(vts) => fail('expected an error, not vehicles types'),
			(error) => expect(error.error).toContain('http request failed')
		);
	});

	it('Should Not create vehicleType becouse of vehicle type model validation failed ', () => {
		let x = spyOn(VehicleType, 'create').and.throwError(new Error('Error creating vehicle type'));

		httpClientSpy.post.and.returnValue(throwError({ error: 'http request failed' }));

		let expError = false;
		try {
			VTservice.registerVehicleType(undefined).subscribe(
				(vts) => fail('expected an error, not vehicles types'),
				(error) => fail('expected an error from local validation, not from http')
			);
		} catch (err) {
			expError = true;
			expect(err.message).toBe('Error creating vehicle type');
		}
		expect(expError).toBe(true); // to confirm it checked the catch
	});
});
