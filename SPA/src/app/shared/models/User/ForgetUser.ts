export class ForgetUser {
	private _email: string;
	private _password?: string;
	private _message?: string;
	private constructor(email: string, password?: string, message?: string) {
		if (this.validateEmail(email) == false) {
			throw new Error('Email  format is not valid');
		}

		if (password != null) {
			if (this.validatePasword(password) == false) {
				throw new Error('Password is not correct, must be 6 characters long');
			}
			this._password = password;
		}
		this._email = email;

		if (message) {
			this._message = message;
		}
	}

	public get email(): string {
		return this._email;
	}

	public get password(): string {
		return this._password;
	}
	public get message(): string {
		return this._message;
	}

	private validate(email: string, password: string): boolean {
		return this.validateEmail(email) && this.validatePasword(password);
	}
	private validateEmail(email: string): boolean {
		const atLocation = email.lastIndexOf('@');
		const dotLocation = email.lastIndexOf('.');
		return atLocation > 0 && dotLocation > atLocation + 1 && dotLocation < email.length - 1;
	}
	private validatePasword(password: string): boolean {
		return password.length >= 6;
	}

	public static Create(obj: any) {
		let t = new ForgetUser(obj.email, obj.password, obj.message);

		return t;
	}
}
