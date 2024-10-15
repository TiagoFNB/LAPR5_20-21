import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { registerUserActionsService } from '../../core/services/user-actions/registerUser-actions.service';
import { AuthenticationService } from '../../core/services/authentication-actions/authentication.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { RegisterUser } from 'src/app/shared/models/User/RegisterUser';
@Component({
	selector: 'app-register',
	templateUrl: './user-registration.component.html',
	styleUrls: [ './user-registration.component.css' ]
})
export class UserRegistrationComponent implements OnInit {
	errorMessage: string;
	successMessage: string;
	loading = false;
	submitted = false;

	countryList: string[];
	privacyPolicy: boolean = false;
	model: NgbDateStruct;
	date: { year: number; month: number };
	public userPrototype = {
		// object of the same type as User with default values
		name: undefined,
		email: undefined,
		password: undefined,
		street: undefined,
		city: undefined,
		country: undefined,
		dateOfBirth: undefined
	};
	constructor(private userService: registerUserActionsService, private router: Router) {}

	ngOnInit() {
		this.countryList = [ 'Portugal', 'Spain', 'France', 'Germany', 'England', 'North America', 'China', 'Other' ];
	}

	// convenience getter for easy access to form fields

	onSubmit(form) {
		this.loading = true;
		try {
			let user: RegisterUser = RegisterUser.Create(this.userPrototype);

			this.userService.registerUser(user).subscribe(
				(data) => {
					this.errorMessage = undefined;
					this.successMessage = 'User Created Sucessfully, you will be redirected to the login page... ';

					//	return data;
					setTimeout(() => {
						form.resetForm();
						this.router.navigate([ '/login' ]);
					}, 10000); //10s
				},
				(error) => {
					this.loading = false;

					this.handleErrors(error);
					return error;
				}
			);
		} catch (err) {
			this.loading = false;
			this.handleErrors(err.message);
		}
	}

	handleErrors(error) {
		this.successMessage = undefined;

		if (error.toString().substring(0, 16) == 'E11000 duplicate') {
			return (this.errorMessage = 'Error: That user already exists in the system');
		} else if (error.toString().includes('proxy')) {
			return (this.errorMessage = 'Error: could not connect to backend server');
		} else if (error) {
			if (error.toString().includes('ProgressEvent')) {
				return (this.errorMessage = 'Could not connect to the server');
			}
			return (this.errorMessage = error.toString());
		}

		return (this.errorMessage =
			'Password must be between 6 and 14 characters long, if you keep getting this error contact the administrator (rogernio@gmail.com)');
	}

	ChangeStateOfPrivacyPolicy(t: boolean) {
		if (t == null) {
			this.privacyPolicy = !this.privacyPolicy;
		} else {
			this.privacyPolicy = t;
		}
	}
}
