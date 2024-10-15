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
import { ForgetUserMapperService } from './mappers/forgetUserMapper.service';
import { ForgetUserDto } from 'src/app/shared/models/User/Dto/ForgetUserDto';
import { ForgetUser } from 'src/app/shared/models/User/ForgetUser';
import { AuthenticationService } from '../authentication-actions/authentication.service';

@Injectable({
	providedIn: 'root'
})
export class forgetUserActionsService {
	MDVURL = environment.MDVURL;

	constructor(
		private http: HttpClient,
		private forgetUserMapperService: ForgetUserMapperService,
		private authenticationService: AuthenticationService
	) {}

	ForgetUser(obj: ForgetUser): Observable<ForgetUserDto> {
		let headers = { 'content-type': 'application/json' };
		let forgetUserDto: ForgetUserDto = this.forgetUserMapperService.FromModelToForgetUserDto(obj);
		const body = JSON.stringify(forgetUserDto);
		let result = this.http.post<ForgetUserDto>(this.MDVURL + '/mdvapi/ForgetUser', body, { headers: headers }).pipe(
			catchError((err) => {
				if (err.error != undefined) {
					throw err;
				} else {
					throw new Error(err);
				}
			})
		);

		return result;
	}

	LogOut() {
		this.authenticationService.logout();
	}
}
