import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
	constructor(public auth: AuthenticationService) {}
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		//console.log('entrou interceptor');
		if (this.auth.currentUserValue) {
			//console.log('e viu que havia um user logged in com token ' + this.auth.currentUserValue.token);
			// only add the header if theres a user loged in
			request = request.clone({
				setHeaders: {
					//Authorization: `Bearer ${this.auth.currentUserValue.token}`
					Authorization: `Bearer ${JSON.parse(localStorage.getItem('currentUser')).token}`
					// could use many options here to get the otken, the local storage or the saved user in auth service,
				}
			});
		}

		return next.handle(request);
	}
}
