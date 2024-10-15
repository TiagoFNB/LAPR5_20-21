import { NodeInterface } from 'src/app/shared/models/node/NodeInterface';
import { LoggedinUser } from 'src/app/shared/models/User/LoggedinUser';

describe('Loggedin User Model', () => {
	it('Should create LoggedinUser success case 1', () => {
		// all possible information
		const expectedN = {
			email: 'email1@gmail.com',
			role: 'User',
			password: 'myPass',
			name: 'roger',
			token: 'Possible token'
		};

		const createdloginuser = LoggedinUser.Create(expectedN);
		expect(createdloginuser.name).toEqual(expectedN.name, fail);
		expect(createdloginuser.email).toEqual(expectedN.email, fail);
		expect(createdloginuser.password).toEqual(expectedN.password, fail);
		expect(createdloginuser.token).toEqual(expectedN.token, fail);
		expect(createdloginuser.role).toEqual(expectedN.role, fail);
	});

	it('Should create LoggedinUser success case 2', () => {
		// only necessary data
		// all possible information
		const expectedN = {
			email: 'email1@gmail.com',
			password: 'myPass'
		};

		const createdloginuser = LoggedinUser.Create(expectedN);

		expect(createdloginuser.email).toEqual(expectedN.email, fail);
		expect(createdloginuser.password).toEqual(expectedN.password, fail);
	});

	it('Should not create LoggedinUser error case 1', () => {
		// email invalid
		// only necessary data
		// all possible information
		const expectedN = {
			email: 'email1@gmail',
			password: 'myPass'
		};
		try {
			const createdloginuser = LoggedinUser.Create(expectedN);
			expect(1).toEqual(2);
		} catch (err) {
			expect(err).toBeDefined();
		}
	});

	it('Should not create LoggedinUser error case 1', () => {
		// email udnefined
		// only necessary data
		// all possible information
		const expectedN = {
			password: 'myPass'
		};
		try {
			const createdloginuser = LoggedinUser.Create(expectedN);
			expect(1).toEqual(2);
		} catch (err) {
			expect(err).toBeDefined();
		}
	});
});
