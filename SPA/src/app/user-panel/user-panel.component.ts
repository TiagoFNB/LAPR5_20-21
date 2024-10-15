import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { forgetUserActionsService } from '../core/services/user-actions/ForgetUser-actions.service';
import { ForgetUserDto } from '../shared/models/User/Dto/ForgetUserDto';
import { ForgetUser } from '../shared/models/User/ForgetUser';

@Component({
	selector: 'app-user-panel',
	templateUrl: './user-panel.component.html',
	styleUrls: [ './user-panel.component.css' ]
})
export class UserPanelComponent implements OnInit {
	public loading: boolean;
	public submitted: boolean;
	public successMessage: string;
	public errorMessage: string;
	public forgetUserPrototype = {
		email: undefined,
		password: undefined
	};

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private forgetUserActionsService: forgetUserActionsService
	) {}

	ngOnInit(): void {}

	onSubmit(form) {
		this.submitted = true;
		this.loading = true;
		// stop here if form is invalid
		let model: ForgetUser;

		try {
			model = ForgetUser.Create(this.forgetUserPrototype);
		} catch (error) {
			return this.handleErrors(error.message);
		}

		//let loginuserdto: LoginUserDto = new LoginUserDto();
		// loginuserdto.Email = this.f.Email.value;
		// loginuserdto.Email = this.f.Password.value;

		this.forgetUserActionsService.ForgetUser(model).pipe(first()).subscribe(
			(data: ForgetUserDto) => {
				this.errorMessage = undefined;
				this.successMessage = data.message + '. You will be redirected to home page.';
				setTimeout(() => {
					this.router.navigate([ '/' ]);
					this.forgetUserActionsService.LogOut();
				}, 6500);
				//this.router.navigate([ '/' ]);
			},
			(error) => {
				this.loading = false;
				this.handleErrors(error);
			}
		);
	}

	handleErrors(error) {
		this.successMessage = undefined;

		try {
			this.errorMessage = error.error.message;
		} catch (e) {
			if (typeof error === 'string') {
				//console.log('login error');
				//console.log(error);
				this.errorMessage = error;
			} else {
				this.errorMessage = 'Could not connect to the server';
			}
		}
	}
}
