import { Injectable } from '@angular/core';

import { RegisterUserDto } from 'src/app/shared/models/User/Dto/RegisterUserDto';
import { RegisterUser } from 'src/app/shared/models/User/RegisterUser';

@Injectable({ providedIn: 'root' })
export class RegisterUserMapperService {
	public constructor() {}
	public FromModelToRegisterUserDto(user: RegisterUser): RegisterUserDto {
		let registerUserDto: RegisterUserDto = {
			email: user.Email,
			password: user.Password,
			name: user.Name,
			street: user.Street,
			city: user.City,
			country: user.Country,
			dateOfBirth: user.DateOfBirth
		};
		return registerUserDto;
	}
}
