import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthGuard } from '../guards/adminAuth.guard';

import { AuthenticationService } from '../services/authentication-actions/authentication.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: [ './header.component.css' ]
})
export class HeaderComponent implements OnInit {
	constructor(
		private authService: AuthenticationService,
		private router: Router,
		private adminAuthGuard: AdminAuthGuard,
		private authenticationService: AuthenticationService
	) {}

	ngOnInit(): void {
		var x = localStorage.getItem('currentUser');
	}

	LogoutFromWebsite() {
		this.authService.logout();
		this.router.navigate([ '/login' ]);
	}
	LoginFromWebsite() {
		this.router.navigate([ '/login' ]);
	}

	public CheckAuthorization(): string {
		if (this.authenticationService.currentUserValue) {
			return this.authenticationService.currentUserValue.role;
		}
	}

	public getLogedUserName(): string {
		if (this.authenticationService.currentUserValue) {
			return this.authenticationService.currentUserValue.name;
		}
	}
}
