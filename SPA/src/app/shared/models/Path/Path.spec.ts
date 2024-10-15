import { PathInterface } from 'src/app/shared/models/path/PathInterface';
import { PathSegmentInterface } from 'src/app/shared/models/Path/PathSegment/PathSegmentInterface';
import { Path } from 'src/app/shared/models/path/Path';

describe('Path Model', () => {
	it('Should create Path success case 1', () => {
		const expectedPathSegment: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }

        const expectedPathSegment2: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }



		const expectedPath: PathInterface = {
			key: 'nam1',
			line: 'line1',
            type: 'Go',
            pathSegments: [expectedPathSegment,expectedPathSegment2],
			isEmpty:true
        };

		const createdpath = Path.create(expectedPath);
		expect(createdpath.key).toEqual(expectedPath.key, fail);
		expect(createdpath.line).toEqual(expectedPath.line, fail);
		expect(createdpath.pathSegments.length).toEqual(expectedPath.pathSegments.length, fail);
		expect(createdpath.isEmpty).toEqual(expectedPath.isEmpty, fail);
	});

	it('Should create Path  error case 1  key is small', () => {
		const expectedPathSegment: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }

        const expectedPathSegment2: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }


		const expectedPath: PathInterface = {
			key: 'n',
			line: 'line1',
            type: 'Go',
            pathSegments: [expectedPathSegment,expectedPathSegment2],
			isEmpty:true
        };
		try {
			const node = Path.create(expectedPath);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toEqual(
				'the identification is too short',
				fail
			);
		}
	});

	it('Should create Node  error case 2  line unknown', () => {
		const expectedPathSegment: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }

        const expectedPathSegment2: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }

        // let pathSegArray : PathSegmentInterface[];
        // pathSegArray.push(expectedPathSegment);
        // pathSegArray.push(expectedPathSegment2);


		const expectedPath: PathInterface = {
			key: 'nam1',
			line: '',
            type: 'Go',
            pathSegments: [expectedPathSegment,expectedPathSegment2],
			isEmpty:true
        };
		try {
			const path = Path.create(expectedPath);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toEqual(
				'Line is required',
				fail
			);
		}
	});

	it('Should create Node  error case 3  Path type unknown', () => {
		const expectedPathSegment: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }

        const expectedPathSegment2: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }

        // let pathSegArray : PathSegmentInterface[];
        // pathSegArray.push(expectedPathSegment);
        // pathSegArray.push(expectedPathSegment2);


		const expectedPath: PathInterface = {
			key: 'nam1',
			line: 'line1',
            type: '',
            pathSegments: [expectedPathSegment,expectedPathSegment2],
			isEmpty:true
        };
		try {
			const path = Path.create(expectedPath);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toEqual(
				'Path type is required',
				fail
			);
		}
	});

	it('Should create Node  error case 4  no pathsegments', () => {
		const expectedPathSegment: PathSegmentInterface = {
            node1:'yo',
            node2:'y2o',
            duration:5,
            distance:5,
        }

        const expectedPathSegment2: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }

        // let pathSegArray : PathSegmentInterface[];
        // pathSegArray.push(expectedPathSegment);
        // pathSegArray.push(expectedPathSegment2);


		const expectedPath: PathInterface = {
			key: 'nam1',
			line: 'line1',
            type: 'Go',
            pathSegments: [],
			isEmpty:true
        };
		try {
			const path = Path.create(expectedPath);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toEqual(
				'Must add segments to the path',
				fail
			);
		}
	});

	it('Should create Node  error case 5  key is not specified', () => {
		const expectedPathSegment: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }

        const expectedPathSegment2: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }

		const expectedPath: PathInterface = {
			key: undefined,
			line: 'line1',
            type: 'Go',
            pathSegments: [expectedPathSegment,expectedPathSegment2],
			isEmpty:true
        };
		try {
			const path = Path.create(expectedPath);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toEqual(
				'Identification is required',
				fail
			);
		}
	});

	
});
