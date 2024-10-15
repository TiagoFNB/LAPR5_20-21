import { Injectable } from '@angular/core';
import { NodeInterface } from 'src/app/shared/models/node/NodeInterface';
import { Node } from 'src/app/shared/models/node/Node';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { RegisterUserDto } from 'src/app/shared/models/User/Dto/RegisterUserDto';
import { RegisterUser } from 'src/app/shared/models/User/RegisterUser';
import { RegisterUserMapperService } from './mappers/registerUserMapper.service';

@Injectable({
	providedIn: 'root'
})
export class registerUserActionsService {
	MDVURL = environment.MDVURL;

	constructor(private http: HttpClient, private registerUserMapperService: RegisterUserMapperService) {
		let x = http;
	}

	registerUser(obj: RegisterUser): Observable<RegisterUserDto> {
		this.verifyIfUserIsAlreadySigned();

		let headers = { 'content-type': 'application/json' };
		let registerUserDto: RegisterUserDto = this.registerUserMapperService.FromModelToRegisterUserDto(obj);
		const body = JSON.stringify(registerUserDto);
		return this.http.post<RegisterUserDto>(this.MDVURL + '/mdvapi/User/register', body, { headers: headers }).pipe(
			catchError((err) => {
				//console.log('aquiii');
				//console.log(err.error);
				throw new Error(err.error);
			})
		);
	}

	private verifyIfUserIsAlreadySigned() {
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if (currentUser) {
			throw new Error('You are already logged in');
		}
	}
}
