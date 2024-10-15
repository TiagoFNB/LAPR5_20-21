import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import { LoginUserDto } from 'src/app/shared/models/User/Dto/LoginUserDto';
import { LoginUserMapperService } from '../user-actions/mappers/loginUserMapper.service';
import { catchError, retry } from 'rxjs/operators';
import { LoginResultDto } from 'src/app/shared/models/User/Dto/LoginResultDto';
import { LoggedinUser } from 'src/app/shared/models/User/LoggedinUser';
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private currentUserSubject: BehaviorSubject<LoggedinUser>;
	public currentUser: Observable<LoggedinUser>;
	MDVURL = environment.MDVURL;

	constructor(private http: HttpClient, private userMapperService: LoginUserMapperService) {
		this.currentUserSubject = new BehaviorSubject<LoggedinUser>(JSON.parse(localStorage.getItem('currentUser')));
		this.currentUser = this.currentUserSubject.asObservable();
	}

	public get currentUserValue(): LoggedinUser {
		//console.log('check here currentUserValue');
		//console.log(this.currentUserSubject.value);
		return this.currentUserSubject.value;
	}

	login(user: LoggedinUser) {
		let loginUserDto: LoginUserDto = this.userMapperService.FromModelToLoginUserDto(user);
		const body = JSON.stringify(loginUserDto);

		let headers = { 'content-type': 'application/json' };
		return this.http.post<any>(`${this.MDVURL}/mdvapi/User/login`, body, { headers: headers }).pipe(
			map((user: LoginResultDto) => {
				// store user details and jwt token in local storage to keep user logged in between page refreshes
				localStorage.setItem('currentUser', JSON.stringify(user));

				let loggedUser: LoggedinUser = this.userMapperService.FromLoginResponseToModelLogedIn(user);

				this.currentUserSubject.next(loggedUser);

				return user;
			}),
			catchError((err) => {
				throw err;
			})
		);
	}

	logout() {
		// remove user from local storage and set current user to null
		localStorage.removeItem('currentUser');
		this.currentUserSubject.next(null);
	}

	retrieveForgottenPassword(email: string) {
		let headers = { 'content-type': 'application/json' };
		let body = `{"Email":"${email}"}`;
		return this.http.post<any>(`${this.MDVURL}/mdvapi/User/retrievepassword`, body, { headers: headers }).pipe(
			map((user) => {
				// store user details and jwt token in local storage to keep user logged in between page refreshes

				return true;
			}),
			catchError((err) => {
				throw err;
			})
		);
	}
}
