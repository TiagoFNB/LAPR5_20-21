import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoggedinUser } from 'src/app/shared/models/User/LoggedinUser';
import { AuthenticationService } from '../services/authentication-actions/authentication.service';

@Injectable({
	providedIn: 'root'
})
export class ManagerAuthGuard implements CanActivate {
	constructor(private router: Router, private authenticationService: AuthenticationService) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		//const currentUser = this.authenticationService.currentUserValue;
		const currentUser: LoggedinUser = JSON.parse(localStorage.getItem('currentUser'));
		if (currentUser) {
			if (
				currentUser.role == 'Manager' ||
				currentUser.role == 'Admin' ||
				currentUser.role == 'manager' ||
				currentUser.role == 'admin'
			) {
				// authorised so return true

				return true;
			}
		}

		// not logged in so redirect to login page with the return url
		this.router.navigate([ '/login' ], { queryParams: { returnUrl: state.url } });
		return false;
	}
}
