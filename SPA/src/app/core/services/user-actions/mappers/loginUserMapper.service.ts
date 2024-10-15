import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

import { LoginUserDto } from 'src/app/shared/models/User/Dto/LoginUserDto';
import { LoggedinUser } from 'src/app/shared/models/User/LoggedinUser';

@Injectable({ providedIn: 'root' })
export class LoginUserMapperService {
	public constructor() {}

	public FromModelToLoginUserDto(user: LoggedinUser): LoginUserDto {
		//console.log('dasdasadasdada');
		//console.log(user);
		let loginUserDto: LoginUserDto = {
			Email: user.email,
			Password: user.password
		};
		return loginUserDto;
	}

	public FromLoginResponseToModelLogedIn(response: any): LoggedinUser {
		const user: LoggedinUser = LoggedinUser.Create(response);
		return user;
	}
}
