import { Node } from '../../../../Node/domain/Node';
describe('Filter function', () => {
	test('it should create a node sucessfully (case 1)', async () => {
		//shall create a node sucessfully and even if  (isReliefPoint: false) it shall return it as true becouse when a node is a depot it is also a relief station

		const object = {
			key: 'key1',
			name: 'name1',
			latitude: '10.1',
			longitude: '10.7',
			shortName: 'shrnm',
			isDepot: true,
			isReliefPoint: false,
			crewTravelTimes: 100,
			node: 'shrnm2'
		};
		let node;
		await Node.create(object).then((result) => {
			node = result;
		});
		expect(node.key).toBe('key1');
		expect(node.name).toBe('name1');
		expect(node.coordinates.latitude).toBe('10.1');
		expect(node.coordinates.longitude).toBe('10.7');

		expect(node.shortName.shortName).toBe('shrnm');
		expect(node.node_Type.isDepot).toBe(true);
		expect(node.node_Type.isReliefPoint).toBe(true); // becouse the node is depot, it is also a relief point even if send it as false
		expect(node.node_Type.crewTravelTimeDuration).toBe(100);
		expect(node.node_Type.crewTravelTimeReferenceNode.shortName).toBe('shrnm2');
	});

	test('it should create a node sucessfully   (case 2)', async () => {
		// key is not defined, shall still create Node sucessfully
		const object = {
			name: 'name1',
			latitude: '10.1',
			longitude: '10.7',
			shortName: 'shrnm',
			isDepot: true,
			isReliefPoint: false,
			crewTravelTimes: 100,
			node: 'shrnm2'
		};
		let node;
		await Node.create(object).then((result) => {
			node = result;
		});
		expect(node.key).toBe(undefined);
		expect(node.name).toBe('name1');
		expect(node.coordinates.latitude).toBe('10.1');
		expect(node.coordinates.longitude).toBe('10.7');

		expect(node.shortName.shortName).toBe('shrnm');
		expect(node.node_Type.isDepot).toBe(true);
		expect(node.node_Type.isReliefPoint).toBe(true); // becouse the node is depot, it is also a relief point even if send it as false
		expect(node.node_Type.crewTravelTimeDuration).toBe(100);
		expect(node.node_Type.crewTravelTimeReferenceNode.shortName).toBe('shrnm2');
	});

	test('it should create a node sucessfully   (case 3)', async () => {
		// crewTravelTimeReferenceNode is not defined, shall still create Node sucessfully and the default value shall be its own shortName (shrnm)
		const object = {
			name: 'name1',
			latitude: '10.1',
			longitude: '10.7',
			shortName: 'shrnm',
			isDepot: true,
			isReliefPoint: false,
			crewTravelTimes: 100
		};
		let node;
		await Node.create(object).then((result) => {
			node = result;
		});
		expect(node.key).toBe(undefined);
		expect(node.name).toBe('name1');
		expect(node.coordinates.latitude).toBe('10.1');
		expect(node.coordinates.longitude).toBe('10.7');

		expect(node.shortName.shortName).toBe('shrnm');
		expect(node.node_Type.isDepot).toBe(true);
		expect(node.node_Type.isReliefPoint).toBe(true); // becouse the node is depot, it is also a relief point even if send it as false
		expect(node.node_Type.crewTravelTimeDuration).toBe(100);
		expect(node.node_Type.crewTravelTimeReferenceNode.shortName).toBe('shrnm');
	});

	test('it should create a node sucessfully   (case 4)', async () => {
		// both crewTravelTime and crewTravelTimeReferenceNode is not defined, i assumed that it is not required even if a node is depot or relief point
		const object = {
			name: 'name1',
			latitude: '10.1',
			longitude: '10.7',
			shortName: 'shrnm',
			isDepot: true,
			isReliefPoint: false
		};
		let node;
		await Node.create(object).then((result) => {
			node = result;
		});
		expect(node.key).toBe(undefined);
		expect(node.name).toBe('name1');
		expect(node.coordinates.latitude).toBe('10.1');
		expect(node.coordinates.longitude).toBe('10.7');

		expect(node.shortName.shortName).toBe('shrnm');
		expect(node.node_Type.isDepot).toBe(true);
		expect(node.node_Type.isReliefPoint).toBe(true); // becouse the node is depot, it is also a relief point even if send it as false
		expect(node.node_Type.crewTravelTimeDuration).toBe(undefined);
		expect(node.node_Type.crewTravelTimeReferenceNode).toBe(undefined);
	});

	test('it should create a node sucessfully   (case 5)', async () => {
		// Now the node is not a depot but is only a relief point
		const object = {
			name: 'name1',
			latitude: '10.1',
			longitude: '10.7',
			shortName: 'shrnm',
			isDepot: false,
			isReliefPoint: true
		};
		let node;
		await Node.create(object).then((result) => {
			node = result;
		});

		expect(node.key).toBe(undefined);
		expect(node.name).toBe('name1');
		expect(node.coordinates.latitude).toBe('10.1');
		expect(node.coordinates.longitude).toBe('10.7');

		expect(node.shortName.shortName).toBe('shrnm');
		expect(node.node_Type.isDepot).toBe(false);
		expect(node.node_Type.isReliefPoint).toBe(true);
		expect(node.node_Type.crewTravelTimeDuration).toBe(undefined);
		expect(node.node_Type.crewTravelTimeReferenceNode).toBe(undefined);
	});

	test('it should Not create a node sucessfully   (error 1)', async () => {
		// the name is not defined
		const object = {
			latitude: '10.1',
			longitude: '10.7',
			shortName: 'shrnm',
			isDepot: false,
			isReliefPoint: false
		};
		let err;
		await Node.create(object).catch((error) => {
			err = error.message;
		});
		expect(err).toBeDefined();
	});

	test('it should Not create a node sucessfully   (error 2)', async () => {
		// the latitude is defined as a string
		const object = {
			name: 'name1',
			longitude: '10.7',
			shortName: 'shrnm',
			isDepot: false,
			isReliefPoint: false
		};
		let err;
		await Node.create(object).catch((error) => {
			err = error.message;
		});
		expect(err).toBeDefined();
	});

	test('it should Not create a node sucessfully   (error 3)', async () => {
		// the longitude is defined as a string
		const object = {
			name: 'name1',
			latitude: '10.7',
			shortName: 'shrnm',
			isDepot: false,
			isReliefPoint: false
		};
		let err;
		await Node.create(object).catch((error) => {
			err = error.message;
		});
		expect(err).toBeDefined();
	});

	test('it should Not create a node sucessfully   (error 4)', async () => {
		// the longitude is defined as a number
		const object = {
			name: 'name1',
			latitude: 10.7,
			shortName: 'shrnm',
			isDepot: false,
			isReliefPoint: false
		};
		let err;
		await Node.create(object).catch((error) => {
			err = error.message;
		});
		expect(err).toBeDefined();
	});

	test('it should Not create a node sucessfully   (error 5)', async () => {
		// the latitude is defined as a number
		const object = {
			name: 'name1',
			latitude: 10.7,
			shortName: 'shrnm',
			isDepot: false,
			isReliefPoint: false
		};
		let err;
		await Node.create(object).catch((error) => {
			err = error.message;
		});
		expect(err).toBeDefined();
	});

	test('it should Not create a node sucessfully   (error 6)', async () => {
		// the longitude is defined as a string
		const object = {
			name: 'name1',
			latitude: '10.7',
			shortName: 'shrnm',
			isDepot: false,
			isReliefPoint: false
		};
		let err;
		await Node.create(object).catch((error) => {
			err = error.message;
		});
		expect(err).toBeDefined();
	});

	test('it should Not create a node sucessfully   (error 7)', async () => {
		// now the object dont have depot nor reliefPoint defined
		const object = {
			name: 'name1',
			latitude: '10.1',
			longitude: '10.7',
			shortName: 'shrnm'
		};
		let err;
		await Node.create(object).catch((error) => {
			err = error.message;
		});

		expect(err).toBeDefined();
	});

	test('it should Not create a node sucessfully   (error 8)', async () => {
		// now the object is not a depot or relief point but have crewTravelTime and its referent node so should fail
		const object = {
			key: 'key1',
			name: 'name1',
			latitude: '10.1',
			longitude: '10.7',
			shortName: 'shrnm',
			isDepot: false,
			isReliefPoint: false,
			crewTravelTimes: 100,
			node: 'shrnm2'
		};
		let err;
		await Node.create(object).catch((error) => {
			err = error.message;
		});

		expect(err).toBeDefined();
	});

	test('it should Not create a node sucessfully   (error 9)', async () => {
		// now the object is  a relief point  dont have crewTravelTime but  its referent node is  defined so should fail
		const object = {
			key: 'key1',
			name: 'name1',
			latitude: '10.1',
			longitude: '10.7',
			shortName: 'shrnm',
			isDepot: false,
			isReliefPoint: true,
			node: 'shrnm2'
		};
		let err;
		await Node.create(object).catch((error) => {
			err = error.message;
		});

		expect(err).toBeDefined();
	});
	test('it should Not create a node sucessfully   (error 10)', async () => {
		// latitude is invalid
		const object = {
			key: 'key1',
			name: 'name1',
			latitude: '-100.1',
			longitude: '10.7',
			shortName: 'shrnm',
			isDepot: false,
			isReliefPoint: true
		};
		let err;
		await Node.create(object).catch((error) => {
			err = error.message;
		});

		expect(err).toBeDefined();
	});

	test('it should Not create a node sucessfully   (error 11)', async () => {
		// longitude is invalid
		const object = {
			key: 'key1',
			name: 'name1',
			latitude: '-10.1',
			longitude: '-200.7',
			shortName: 'shrnm',
			isDepot: false,
			isReliefPoint: true
		};
		let err;
		await Node.create(object).catch((error) => {
			err = error.message;
		});

		expect(err).toBeDefined();
	});
});
