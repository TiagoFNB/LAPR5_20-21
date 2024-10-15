import { UnsignedShort5551Type } from 'three';

export class RegisterUser {
	private _Name: string;
	private _Email: string;
	private _Street: string;
	private _City: string;
	private _Country: string;
	private _Password: string;
	private _DateOfBirth: string;
	private constructor(
		email: string,
		password: string,
		name: string,
		street: string,
		city: string,
		country: string,
		dateOfBirth: string
	) {
		this.validate(email, password, name, street, city, country, dateOfBirth);
		this._Email = email;
		this._Password = password;
		this._Name = name;
		this._Street = street;
		this._City = city;
		this._Country = country;
		this._DateOfBirth = dateOfBirth;
	}

	public static Create(obj) {
		let user: RegisterUser = new RegisterUser(
			obj.email,
			obj.password,
			obj.name,
			obj.street,
			obj.city,
			obj.country,
			obj.dateOfBirth
		);

		return user;
	}

	private validate(
		email: string,
		password: string,
		name: string,
		street: string,
		city: string,
		country: string,
		dateOfBirth: string
	) {
		if (email) {
			let emailval = this.isValidEmail(email);
			if (emailval == false) {
				throw new Error('Email is not valid');
			}
		} else if (email == null || email == undefined) {
			throw new Error('Email is not defined');
		}

		if (password) {
			if (password.length < 6) {
				throw new Error('Password Must be  atleast 6 characters long ');
			}
		} else {
			throw new Error('Password Must be  defined ');
		}

		if (name) {
			if (name.length < 3 || name.length > 50) {
				throw new Error('Name must have atleast 3 characters');
			}
		} else {
			throw new Error('Name Must be  defined ');
		}

		if (street) {
			if (street.length < 4) {
				throw new Error('Street must have atleast 4 characters');
			}
		} else {
			throw new Error('Street Must be  defined ');
		}

		if (country) {
			if (country.length < 3) {
				throw new Error('Country must have atleast 4 characters');
			}
		} else {
			throw new Error('Country Must be  defined ');
		}

		if (city) {
			if (city.length < 4) {
				throw new Error('City must have atleast 4 characters');
			}
		} else {
			throw new Error('City Must be  defined ');
		}

		if (dateOfBirth) {
			if (dateOfBirth.length != 10) {
				throw new Error('DateOfBirth must be 10 characters in format YYYY-MM-DD');
			}
			try {
				Date.parse(dateOfBirth);
			} catch (err) {
				throw new Error('DateOfBirth must be 10 characters in format YYYY-MM-DD');
			}
		} else {
			throw new Error('Date of Birth Must be  defined ');
		}
	}

	private isValidEmail(value): boolean {
		const atLocation = value.lastIndexOf('@');
		const dotLocation = value.lastIndexOf('.');
		return atLocation > 0 && dotLocation > atLocation + 1 && dotLocation < value.length - 1;
	}

	public get Email() {
		return this._Email;
	}
	public get Name() {
		return this._Name;
	}
	public get Password() {
		return this._Password;
	}

	public get Street() {
		return this._Street;
	}

	public get City() {
		return this._City;
	}

	public get Country() {
		return this._Country;
	}

	public get DateOfBirth() {
		return this._DateOfBirth;
	}
}
