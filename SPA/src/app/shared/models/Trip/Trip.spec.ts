import { TripInterface } from 'src/app/shared/models/Trip/TripInterface';
import { Trip } from 'src/app/shared/models/Trip/Trip';

describe('Trip Model', () => {
	it('Should create Trip success case 1', () => {
		const expectedTrip: TripInterface = {
            PathId:'pathTest',
            LineId:'lineTest',
            StartingTime:50
        }

		const createdtrip = Trip.Create(expectedTrip);
		expect(createdtrip.PathId).toEqual(expectedTrip.PathId, fail);
		expect(createdtrip.LineId).toEqual(expectedTrip.LineId, fail);
		expect(createdtrip.StartingTime).toEqual(expectedTrip.StartingTime, fail);
	});

	it('Should create Trip success case 2', () => {
		const expectedTrip: TripInterface = {
            PathId:'pathTest',
            LineId:'lineTest',
			StartingTime:50,
			EndTime:500,
			Frequency:50
        }

		const createdtrip = Trip.Create(expectedTrip);
		expect(createdtrip.PathId).toEqual(expectedTrip.PathId, fail);
		expect(createdtrip.LineId).toEqual(expectedTrip.LineId, fail);
		expect(createdtrip.StartingTime).toEqual(expectedTrip.StartingTime, fail);
		expect(createdtrip.EndTime).toEqual(expectedTrip.EndTime, fail);
		expect(createdtrip.Frequency).toEqual(expectedTrip.Frequency, fail);
	});

	it('Should not create Trip endtime lower than starting time', () => {
		const expectedTrip: TripInterface = {
            PathId:'pathTest',
            LineId:'lineTest',
			StartingTime:500,
			EndTime:50,
			Frequency:50
        }
		try{
		const createdtrip = Trip.Create(expectedTrip);
	} catch (err) {
		expect(err.message).toEqual(
			'End time cant be lower than starting time',
			fail
		);
	}
	});


	it('Should not create Trip line id is not specified', () => {

		const expectedTrip: TripInterface = {
			PathId: 'pathtest',
			LineId: undefined,
            StartingTime: 500,
        };
		try {
			const path = Trip.Create(expectedTrip);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toEqual(
				'LineId Must be  defined ',
				fail
			);
		}
	});
	it('Should not create Trip path id is not specified', () => {

		const expectedTrip: TripInterface = {
			PathId: undefined,
			LineId: 'linetest',
            StartingTime: 500,
        };
		try {
			const path = Trip.Create(expectedTrip);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toEqual(
				'PathId Must be  defined ',
				fail
			);
		}
	});

	it('Should not create Trip starting time is not specified', () => {

		const expectedTrip: TripInterface = {
			PathId: 'pathtest',
			LineId: 'linetest',
            StartingTime: undefined,
        };
		try {
			const path = Trip.Create(expectedTrip);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toEqual(
				'Starting time must be  defined ',
				fail
			);
		}
	});

	it('Should not create Trip because only frequency is specified, throws error', () => {

		const expectedTrip: TripInterface = {
			PathId: 'pathtest',
			LineId: 'linetest',
			StartingTime: 500,
			EndTime:undefined,
			Frequency:50
        };
		try {
			const path = Trip.Create(expectedTrip);

			expect('catch fail').toEqual('it didnt'); //if reaches throws error
		} catch (err) {
			expect(err.message).toEqual(
				'End time and frequency must be both filled',
				fail
			);
		}
	});

	it('Should not create Trip because only endtime is specified, throws error', () => {

		const expectedTrip: TripInterface = {
			PathId: 'pathtest',
			LineId: 'linetest',
			StartingTime: 500,
			EndTime:10000,
			Frequency:undefined
        };
		try {
			const path = Trip.Create(expectedTrip);

			expect('catch fail').toEqual('it didnt'); //if reaches throws error
		} catch (err) {
			expect(err.message).toEqual(
				'End time and frequency must be both filled',
				fail
			);
		}
	});

});
