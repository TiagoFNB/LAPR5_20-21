import { NodeInterface } from 'src/app/shared/models/node/NodeInterface';
import { Node } from 'src/app/shared/models/node/Node';

describe('Node Model', () => {
	it('Should create Node success case 1', () => {
		const expectedN = {
			name: 'nam1',
			shortName: 'shortName1',
			latitude: 40,
			longitude: 45,
			isDepot: true,
			isReliefPoint: true,
			crewTravelTimes: 10,
			crewTravelTimeReferenceNode: 'RefNode1'
		};

		const creatednode = Node.create(expectedN);
		expect(creatednode.name).toEqual(expectedN.name, fail);
		expect(creatednode.shortName).toEqual(expectedN.shortName, fail);
		expect(creatednode.latitude).toEqual(expectedN.latitude, fail);
		expect(creatednode.longitude).toEqual(expectedN.longitude, fail);
		expect(creatednode.isDepot).toEqual('true', fail);
		expect(creatednode.isReliefPoint).toEqual('true', fail);
		expect(creatednode.crewTravelTimes).toEqual(expectedN.crewTravelTimes, fail);
		expect(creatednode.crewTravelTimeReferenceNode).toEqual(expectedN.crewTravelTimeReferenceNode, fail);
	});

	it('Should create Node  success case 2', () => {
		const expectedN = {
			name: 'nam1',
			shortName: 'shortName1',
			latitude: 40,
			longitude: 45,
			isDepot: false,
			isReliefPoint: false
		};

		const creatednode = Node.create(expectedN);
		expect(creatednode.name).toEqual(expectedN.name, fail);
		expect(creatednode.shortName).toEqual(expectedN.shortName, fail);
		expect(creatednode.latitude).toEqual(expectedN.latitude, fail);
		expect(creatednode.longitude).toEqual(expectedN.longitude, fail);
		expect(creatednode.isDepot).toEqual('false', fail);
		expect(creatednode.isReliefPoint).toEqual('false', fail);
		expect(creatednode.crewTravelTimes).toEqual(undefined, fail);
		expect(creatednode.crewTravelTimeReferenceNode).toEqual(undefined, fail);
	});

	it('Should create Node  error case 1  lat is greater then 90', () => {
		const expectedN = {
			name: 'nam1',
			shortName: 'shortName1',
			latitude: 91,
			longitude: 45,
			isDepot: false,
			isReliefPoint: false
		};
		try {
			const node = Node.create(expectedN);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toEqual(
				'check value of coordinates, -90< latitude >90   and -180< longitude >180',
				fail
			);
		}
	});

	it('Should create Node  error case 2  lat is lesser then -90', () => {
		const expectedN = {
			name: 'nam1',
			shortName: 'shortName1',
			latitude: -91,
			longitude: 45,
			isDepot: false,
			isReliefPoint: false
		};
		try {
			const node = Node.create(expectedN);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toEqual(
				'check value of coordinates, -90< latitude >90   and -180< longitude >180',
				fail
			);
		}
	});

	it('Should create Node  error case 3  long is greater then 180', () => {
		const expectedN = {
			name: 'nam1',
			shortName: 'shortName1',
			latitude: 70,
			longitude: 181,
			isDepot: false,
			isReliefPoint: false
		};
		try {
			const node = Node.create(expectedN);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toEqual(
				'check value of coordinates, -90< latitude >90   and -180< longitude >180',
				fail
			);
		}
	});

	it('Should create Node  error case 4  long is lesser then -180', () => {
		const expectedN = {
			name: 'nam1',
			shortName: 'shortName1',
			latitude: 70,
			longitude: -181,
			isDepot: false,
			isReliefPoint: false
		};
		try {
			const node = Node.create(expectedN);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toEqual(
				'check value of coordinates, -90< latitude >90   and -180< longitude >180',
				fail
			);
		}
	});

	it('Should create Node  error case 5  name is not specified', () => {
		const expectedN = {
			name: '',
			shortName: 'shortName1',
			latitude: 70,
			longitude: -181,
			isDepot: false,
			isReliefPoint: false
		};
		try {
			const node = Node.create(expectedN);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toBeDefined();
		}
	});

	it('Should create Node  error case 6  shortName is not specified', () => {
		const expectedN = {
			name: 'name',
			shortName: '',
			latitude: 70,
			longitude: -181,
			isDepot: false,
			isReliefPoint: false
		};
		try {
			const node = Node.create(expectedN);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toBeDefined();
		}
	});

	it('Should create Node  error case 5  crew travel time reference node is specified but duration is not ', () => {
		const expectedN = {
			name: 'nam1',
			shortName: 'shortName1',
			latitude: 70,
			longitude: 100,
			isDepot: false,
			isReliefPoint: false,
			crewTravelTimes: '',
			crewTravelTimeReferenceNode: 'RefNode1'
		};
		try {
			const node = Node.create(expectedN);

			expect(1).toEqual(2); // if it reaches here then test should fail
		} catch (err) {
			expect(err.message).toEqual(
				'An unexpected error happened, check the required fields and if you specify a reference node dont forget to specify the duration',
				fail
			);
		}
	});
});
