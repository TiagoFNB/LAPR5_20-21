import { RegisterUser } from './RegisterUser';
describe('Loggedin User Model', () => {
	it('Should create RegisterUser success case 1', () => {
		// all possible information
		const expectedN = {
			email: 'email1@gmail.com',
			password: 'myPass',
			name: 'roger',
			city: 'freamunde',
			street: 'Alexaandrino',
			country: 'Portugal',
			dateOfBirth: '1993-07-21'
		};

		const createdreguser = RegisterUser.Create(expectedN);
		expect(createdreguser.Name).toEqual(expectedN.name, fail);
		expect(createdreguser.Email).toEqual(expectedN.email, fail);
		expect(createdreguser.Password).toEqual(expectedN.password, fail);
		expect(createdreguser.City).toEqual(expectedN.city, fail);
		expect(createdreguser.DateOfBirth).toEqual(expectedN.dateOfBirth, fail);
		expect(createdreguser.Country).toEqual(expectedN.country, fail);
		expect(createdreguser.Street).toEqual(expectedN.street, fail);
	});

	it('Should not create RegisterUser error case 1', () => {
		// email invalid
		// all possible information
		const expectedN = {
			email: 'email1@gmail',
			role: 'User',
			password: 'myPass',
			name: 'roger',
			city: 'freamunde',
			street: 'Alexaandrino',
			country: 'Portugal',
			dateOfBirth: '1993-07-21'
		};
		try {
			const createdreguser = RegisterUser.Create(expectedN);
			expect(1).toEqual(2);
		} catch (err) {
			expect(err).toBeDefined();
		}
	});

	it('Should not create RegisterUser error case 2', () => {
		// invalid password

		const expectedN = {
			email: 'email1@gmail.com',
			password: 'my',
			name: 'roger',
			city: 'freamunde',
			street: 'Alexaandrino',
			country: 'Portugal',
			dateOfBirth: '1993-07-21'
		};
		try {
			const createdreguser = RegisterUser.Create(expectedN);
			expect(1).toEqual(2);
		} catch (err) {
			expect(err).toBeDefined();
		}
	});

	it('Should not create RegisterUser error case 3', () => {
		// invalid name

		const expectedN = {
			email: 'email1@gmail.com',
			password: 'mypassword',
			name: '',
			city: 'freamunde',
			street: 'Alexaandrino',
			country: 'Portugal',
			dateOfBirth: '1993-07-21'
		};
		try {
			const createdreguser = RegisterUser.Create(expectedN);
			expect(1).toEqual(2);
		} catch (err) {
			expect(err).toBeDefined();
		}
	});

	it('Should not create RegisterUser error case 4', () => {
		// invalid city

		const expectedN = {
			email: 'email1@gmail.com',
			password: 'mypassword',
			name: 'name1',
			city: '',
			street: 'Alexaandrino',
			country: 'Portugal',
			dateOfBirth: '1993-07-21'
		};
		try {
			const createdreguser = RegisterUser.Create(expectedN);
			expect(1).toEqual(2);
		} catch (err) {
			expect(err).toBeDefined();
		}
	});

	it('Should not create RegisterUser error case 5', () => {
		// invalid street

		const expectedN = {
			email: 'email1@gmail.com',
			password: 'mypassword',
			name: 'name1',
			city: 'city',
			street: '',
			country: 'Portugal',
			dateOfBirth: '1993-07-21'
		};
		try {
			const createdreguser = RegisterUser.Create(expectedN);
			expect(1).toEqual(2);
		} catch (err) {
			expect(err).toBeDefined();
		}
	});

	it('Should not create RegisterUser error case 6', () => {
		// invalid country

		const expectedN = {
			email: 'email1@gmail.com',
			password: 'mypassword',
			name: 'name1',
			city: 'city',
			street: 'street',
			country: '',
			dateOfBirth: '1993-07-21'
		};
		try {
			const createdreguser = RegisterUser.Create(expectedN);
			expect(1).toEqual(2);
		} catch (err) {
			expect(err).toBeDefined();
		}
	});
	it('Should not create RegisterUser error case 7', () => {
		// invalid dateOfBirth

		const expectedN = {
			email: 'email1@gmail.com',
			password: 'mypassword',
			name: 'name1',
			city: 'city',
			street: 'street',
			country: 'country',
			dateOfBirth: '1993'
		};
		try {
			const createdreguser = RegisterUser.Create(expectedN);
			expect(1).toEqual(2);
		} catch (err) {
			expect(err).toBeDefined();
		}
	});
});
