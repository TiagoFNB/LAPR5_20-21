import { Injectable } from '@angular/core';
import { ForgetUser } from 'src/app/shared/models/User/ForgetUser';
import { ForgetUserDto } from 'src/app/shared/models/User/Dto/ForgetUserDto';

@Injectable({ providedIn: 'root' })
export class ForgetUserMapperService {
	public constructor() {}

	public FromModelToForgetUserDto(model: ForgetUser): ForgetUserDto {
		//console.log('dasdasadasdada');
		//console.log(user);
		let forgetUserDto: ForgetUserDto = {
			email: model.email,
			password: model.password
		};
		return forgetUserDto;
	}
}
