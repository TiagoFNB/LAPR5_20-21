import { Injectable } from '@angular/core';

import { RegisterUser } from 'src/app/shared/models/User/RegisterUser';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { forgetUserActionsService } from './ForgetUser-actions.service';
import { ForgetUserMapperService } from './mappers/forgetUserMapper.service';
import { AuthenticationService } from '../authentication-actions/authentication.service';
import { ForgetUserDto } from 'src/app/shared/models/User/Dto/ForgetUserDto';
import { ForgetUser } from 'src/app/shared/models/User/ForgetUser';
import { error } from 'protractor';

let httpClientSpy: { post: jasmine.Spy };
let mapperSpy: { FromModelToForgetUserDto: jasmine.Spy };
let Aservice: forgetUserActionsService;
let AuthServiceSpy: { logout: jasmine.Spy };

describe('Register user Service', () => {
	beforeEach(() => {
		httpClientSpy = jasmine.createSpyObj('HttpClient', [ 'post' ]);
		AuthServiceSpy = jasmine.createSpyObj('AuthenticationService', [ 'logout' ]);
		mapperSpy = jasmine.createSpyObj('ForgetUserMapperService', [ 'FromModelToForgetUserDto' ]);
		Aservice = new forgetUserActionsService(httpClientSpy as any, mapperSpy as any, AuthServiceSpy as any);
	});

	it('should be created', () => {
		expect(Aservice).toBeTruthy();
	});

	it('Should forget a user ', () => {
		AuthServiceSpy.logout.and.returnValue(true);
		httpClientSpy.post.and.returnValue(of({ email: 'email@gmail.com', password: undefined, message: 'success' }));
		mapperSpy.FromModelToForgetUserDto.and.returnValue(of(undefined));

		let expected: ForgetUserDto = {
			email: 'email@gmail.com',
			password: undefined,
			message: 'success'
		};
		Aservice.ForgetUser(undefined).subscribe((result) => expect(result).toEqual(expected), fail);
	});

	it('Should not forget a user. Error from backend', () => {
		AuthServiceSpy.logout.and.returnValue(true);
		httpClientSpy.post.and.returnValue(throwError({ error: 'create dto fail failed' }));
		mapperSpy.FromModelToForgetUserDto.and.returnValue(of(undefined));

		let expected: ForgetUserDto = {
			email: 'email@gmail.com',
			password: undefined,
			message: 'success'
		};
		Aservice.ForgetUser(undefined).subscribe(
			(vts) => fail('expected an error, not an ok response '),
			(error) => {
				expect(error).toBeDefined();
			}
		);
	});
});
