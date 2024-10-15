// import { PathSegmentInterface } from 'src/app/shared/models/Path/PathSegment/PathSegmentInterface';
import { PathSegment } from 'src/app/shared/models/Path/PathSegment/PathSegment';

describe('PathSegment Model', () => {
	it('Should create Path segment success case 1', () => {
		const expectedPathSegment: PathSegment = {
			node1: 'yo',
			node2: 'yo2',
			duration: 5,
			distance: 5,
		}
		
	 	let createdpath = PathSegment.create(expectedPathSegment);

		expect(createdpath.node1).toEqual(expectedPathSegment.node1, fail);
		expect(createdpath.node2).toEqual(expectedPathSegment.node2, fail);
		expect(createdpath.duration).toEqual(expectedPathSegment.duration, fail);
		expect(createdpath.distance).toEqual(expectedPathSegment.distance, fail);

	});

	it('Should not create path segment  error case 1  node1 invalid', () => {
		const expectedPathSegment: PathSegment = {
			node1: undefined,
			node2: 'yo',
			duration: 5,
			distance: 5,
		}

		try {
			const pathseg = PathSegment.create(expectedPathSegment);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {

			expect(err.message).toEqual(
				'First node is required',
				fail
			);
		}
	});

	it('Should not create path segment  error case 2 node2 is invalid', () => {
		const expectedPathSegment: PathSegment= {
			node1: 'yo',
			node2: undefined,
			duration: 5,
			distance: 5,
		}
		try {
			const pathSeg = PathSegment.create(expectedPathSegment);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toEqual(
				'Second node is required',
				fail
			);
		}
	});

	it('Should not create path  error case 3  Duration is required', () => {
		const expectedPathSegment: PathSegment = {
			node1: 'yo',
			node2: 'yo2',
			duration: 0,
			distance: 5,
		}
		try {
			const pathseg = PathSegment.create(expectedPathSegment);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toEqual(
				'Duration is required',
				fail
			);
		}
	});

	it('Should not create path segment  error case 4  distance is required', () => {
		const expectedPathSegment: PathSegment = {
			node1: 'yo',
			node2: 'yo2',
			duration: 5,
			distance: 0,
		}
		try {
			const pathseg = PathSegment.create(expectedPathSegment);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toEqual(
				'Distance is required',
				fail
			);
		}
	});

	it('Should not create path segment  error case 5  nodes are equal', () => {
		const expectedPathSegment: PathSegment = {
			node1: 'yo',
			node2: 'yo',
			duration: 5,
			distance: 5,
		}
		try {
			const pathseg = PathSegment.create(expectedPathSegment);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toEqual(
				'Nodes cant be equal',
				fail
			);
		}
	});


});
