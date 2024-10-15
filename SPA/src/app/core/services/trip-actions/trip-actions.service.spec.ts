import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { PathInterface } from 'src/app/shared/models/path/PathInterface';
import { PathSegmentInterface } from 'src/app/shared/models/Path/PathSegment/PathSegmentInterface';
import { TripActionsService } from './trip-actions.service';
import { RegisterTripMapperService } from './mappers/registerTripMapper';
import { Trip } from 'src/app/shared/models/Trip/Trip';

let createPathSpy: { create: jasmine.Spy };
let httpClientSpy: { get : jasmine.Spy; post: jasmine.Spy };
let tripService: TripActionsService;

describe('TripService', () => {
	beforeEach(() => {
		let mapper = new RegisterTripMapperService();
		httpClientSpy = jasmine.createSpyObj('HttpClient', [ 'get','post' ]);
		tripService = new TripActionsService(httpClientSpy as any, mapper);
	});

	it('should be created', () => {
		expect(tripService).toBeTruthy();
	});

	it('Should create Trip using http request', () => {

		const expectedTrip: any = {
			pathId: 'pathTest',
            lineId: 'lineTest01',
            startingTime: '00:30'
		};
		
		const returnedTrip: any = {
			_pathId: 'pathTest',
            _lineId: 'lineTest01',
            _startingTime: '1800'
        };
        
		// let x = spyOn(Trip, 'Create').and.returnValue(of(returnedTrip));

		httpClientSpy.post.and.returnValue(of(expectedTrip)); // this is to prove the mocks are working becouse if the above mocked method fails this mock wont even be called


		try {
			tripService.registerTrip(expectedTrip).subscribe(
				(trip) => {
					expect(trip).toEqual(expectedTrip);
					
				},
				(error) => {
					fail('expected an error from creating model trip');
				}
			);
		} catch (error) {
			fail('Error creating Trip using http req');
		}
	});

	it('should return an error when the Trip is not sucessfully created ', () => {
		
		const expectedTrip: any = {
			pathId: 'pathTest',
            lineId: 'lineTest01',
            startingTime: '00:30'
        };
        

		let x = spyOn(Trip, 'Create').and.throwError(new Error('Error creating Trip in test2'));

		httpClientSpy.post.and.returnValue(of(expectedTrip)); // this is to prove the mocks are working becouse if the above mocked method fails this mock wont even be called


		try {
			tripService.registerTrip(expectedTrip).subscribe(
				(trip) => {
					fail('expected an error, not a trip');
				},
				(error) => {
					fail('expected an error from creating model trip, not a http error');
				}
			);
		} catch (error) {
			expect(error.message).toContain('Error creating Trip in test2');
		}
	});

	it('should return an error when the server returns a 404', () => {
		const expectedTrip: any = {
			pathId: 'pathTest',
            lineId: 'lineTest01',
            startingTime: '00:30'
        };

		const expectedResponse = new HttpErrorResponse({
			error: 'test 404 error',
			status: 404,
			statusText: 'Not Found'
		});

		httpClientSpy.post.and.returnValue(throwError(expectedResponse));

		tripService.registerTrip(expectedTrip).subscribe(
			(vts) => fail('expected an error, not a trip'),
			(error) => {
				expect(error.error).toContain('test 404 error');
			}
		);
	});

	it('should return a custom error when the server returns a duplicate error message', () => {
		const expectedTrip: any = {
			pathId: 'pathTest',
            lineId: 'lineTest01',
            startingTime: '00:30'
        };

		const expectedResponse = new HttpErrorResponse({
			error: 'E11000 duplicate',
			status: 404,
			statusText: 'Not Found'
		});

		httpClientSpy.post.and.returnValue(throwError(expectedResponse));

		tripService.registerTrip(expectedTrip).subscribe(
			(vts) => fail('expected an error, not a trip'),
			(error) => {
				expect(error.error).toContain('E11000 duplicate');
			}
		);
	});
});
