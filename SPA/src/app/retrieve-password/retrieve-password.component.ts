import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../core/services/authentication-actions/authentication.service';

@Component({
	selector: 'app-retrieve-password',
	templateUrl: './retrieve-password.component.html',
	styleUrls: [ './retrieve-password.component.css' ]
})
export class RetrievePasswordComponent implements OnInit {
	public loading: boolean;
	public successMessage: string;
	public errorMessage: string;
	public email: string;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService
	) {}

	ngOnInit(): void {}

	onSubmit(form) {
		this.loading = true;
		this.authenticationService.retrieveForgottenPassword(this.email).pipe(first()).subscribe(
			(data) => {
				this.errorMessage = undefined;
				this.successMessage =
					'If that email has an account, a new password will be sent.  You will be redirected to the login page...';
				setTimeout(() => {
					this.router.navigate([ '/login' ]);
				}, 10000); //10s
			},
			(error) => {
				this.loading = false;
				this.errorMessage =
					'Could not connect with the server or we are experiencing server problems, check you internet connection or contact the administrator. Error code :' +
					error.toString();
			}
		);
	}
}
