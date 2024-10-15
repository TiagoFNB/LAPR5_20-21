import { Injectable } from '@angular/core';

import { LoggedinUser } from 'src/app/shared/models/User/LoggedinUser';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { LoginUserMapperService } from '../user-actions/mappers/loginUserMapper.service';
let createNodeSpy: { create: jasmine.Spy };
let httpClientSpy: { post: jasmine.Spy };
let mapperSpy: { FromModelToLoginUserDto: jasmine.Spy; FromLoginResponseToModelLogedIn: jasmine.Spy };
let Aservice: AuthenticationService;

describe('AuthenticationService', () => {
	beforeEach(() => {
		//	createNodeSpy = jasmine.createSpyObj('Node', [ 'create' ]);
		httpClientSpy = jasmine.createSpyObj('HttpClient', [ 'post' ]);
		mapperSpy = jasmine.createSpyObj('LoginUserMapperService', [
			'FromModelToLoginUserDto',
			'FromLoginResponseToModelLogedIn'
		]);
		Aservice = new AuthenticationService(httpClientSpy as any, mapperSpy as any);
	});

	it('should be created', () => {
		expect(Aservice).toBeTruthy();
	});

	it('Should login a user using http request', () => {
		const login = {
			email: 'email@gmail.com',
			password: 'password1'
		};
		let loginM: LoggedinUser = LoggedinUser.Create(login);

		const loginResult = {
			name: 'roger',
			email: 'email@gmail.com',
			password: 'password1',
			token: 'TOken',
			role: 'user'
		};

		httpClientSpy.post.and.returnValue(of(loginResult));
		mapperSpy.FromModelToLoginUserDto.and.returnValue(of(login));
		mapperSpy.FromLoginResponseToModelLogedIn.and.returnValue(of(loginM));

		Aservice.login(loginM).subscribe((result) => expect(result).toEqual(loginResult, 'expected loged user'), fail);
	});

	it('Should not login a user using http request error case 1', () => {
		// failed authentication
		const login = {
			email: 'email@gmail.com',
			password: 'password1'
		};
		let loginM: LoggedinUser = LoggedinUser.Create(login);

		httpClientSpy.post.and.returnValue(throwError({ error: 'login failed' }));
		mapperSpy.FromModelToLoginUserDto.and.returnValue(of(login));
		mapperSpy.FromLoginResponseToModelLogedIn.and.returnValue(of(loginM));

		Aservice.login(loginM).subscribe(
			(vts) => fail('expected an error, not an ok response '),
			(error) => {
				expect(error).toBeDefined();
			}
		);
	});

	it('Should logout', () => {
		localStorage.setItem('currentUser', 'name:roger, role:User');
		Aservice.logout();
		let ver = localStorage.getItem('currentUser');
		if (ver) {
			fail('expected to be logged out ');
		} else {
			expect(1).toEqual(1);
		}
	});
});
