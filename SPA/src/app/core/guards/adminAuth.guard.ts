import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoggedinUser } from 'src/app/shared/models/User/LoggedinUser';
import { AuthenticationService } from '../services/authentication-actions/authentication.service';

@Injectable({
	providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
	constructor(private router: Router, private authenticationService: AuthenticationService) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		//this.authenticationService.currentUserValue; // if i
		const currentUser: LoggedinUser = JSON.parse(localStorage.getItem('currentUser'));

		if (currentUser) {
			//console.log('admin guard viu user' + currentUser.role);
			if (currentUser.role == 'Admin' || currentUser.role == 'admin') {
				// authorised so return true
				//console.log('admin guard viu admin');
				return true;
			}
		}

		// not logged in so redirect to login page with the return url
		this.router.navigate([ '/login' ], { queryParams: { returnUrl: state.url } });
		return false;
	}
}
