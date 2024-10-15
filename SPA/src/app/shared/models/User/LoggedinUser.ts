import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { LoginUserDto } from './Dto/LoginUserDto';

export class LoggedinUser {
	private _email: string;
	private _role?: string;
	private _token?: string;
	private _password?: string;
	private _name?: string;
	private constructor(email: string, role?: string, token?: string, name?: string, password?: string) {
		if (this.validate(email) == false) {
			throw new Error('Email format is not valid');
		}
		this._password = password;
		this._email = email;
		if (role) this._role = role;
		if (token) this._token = token;

		if (name) this._name = name;
	}

	public get email(): string {
		return this._email;
	}
	public get role(): string {
		return this._role;
	}
	public get token(): string {
		return this._token;
	}
	public get password(): string {
		return this._password;
	}
	public get name(): string {
		return this._name;
	}

	private validate(email: string): boolean {
		const atLocation = email.lastIndexOf('@');
		const dotLocation = email.lastIndexOf('.');
		return atLocation > 0 && dotLocation > atLocation + 1 && dotLocation < email.length - 1;
	}

	public static Create(obj: any) {
		let t = new LoggedinUser(obj.email, obj.role, obj.token, obj.name, obj.password);

		return t;
	}
}
