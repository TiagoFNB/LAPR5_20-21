import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginUserDto } from '../shared/models/User/Dto/LoginUserDto';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../core/services/authentication-actions/authentication.service';

import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { LoggedinUser } from '../shared/models/User/LoggedinUser';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	loading = false;
	submitted = false;
	returnUrl: string;
	errorMessage: string;
	successMessage: string;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService //	private alertService: AlertService
	) {
		//	redirect to home if already logged in
		if (this.authenticationService.currentUserValue) {
			this.router.navigate([ '/' ]);
		}
	}

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			Email: [ '', Validators.required ],
			Password: [ '', Validators.required ]
		});

		// get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.loginForm.controls;
	}
	get formValuesObject() {
		let t = {
			email: this.f.Email.value,
			password: this.f.Password.value
		};
		return t;
	}

	onSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		let user: LoggedinUser;
		if (this.loginForm.invalid) {
			return;
		}
		try {
			user = LoggedinUser.Create(this.formValuesObject);
		} catch (error) {
			return this.handleErrors(error.message);
		}

		//let loginuserdto: LoginUserDto = new LoginUserDto();
		// loginuserdto.Email = this.f.Email.value;
		// loginuserdto.Email = this.f.Password.value;

		this.loading = true;
		this.authenticationService.login(user).pipe(first()).subscribe(
			(data) => {
				this.errorMessage = undefined;
				this.successMessage = '';
				this.router.navigate([ this.returnUrl ]);
				//this.router.navigate([ '/' ]);
			},
			(error) => {
				this.loading = false;
				this.handleErrors(error.error);
			}
		);
	}

	handleErrors(error) {
		this.successMessage = undefined;
		//console.log('login error');
		//console.log(error);
		if (typeof error === 'string') {
			this.errorMessage = error;
		} else {
			this.errorMessage = 'Could not connect to the server';
		}
	}
}
