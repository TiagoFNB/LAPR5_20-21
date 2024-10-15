import { Injectable } from '@angular/core';

import { RegisterUser } from 'src/app/shared/models/User/RegisterUser';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { registerUserActionsService } from './registerUser-actions.service';
import { RegisterUserMapperService } from '../user-actions/mappers/registerUserMapper.service';

let createNodeSpy: { create: jasmine.Spy };
let httpClientSpy: { post: jasmine.Spy };
let mapperSpy: { FromModelToRegisterUserDto: jasmine.Spy };
let Aservice: registerUserActionsService;

describe('Register user Service', () => {
	beforeEach(() => {
		httpClientSpy = jasmine.createSpyObj('HttpClient', [ 'post' ]);
		mapperSpy = jasmine.createSpyObj('RegisterUserMapperService', [ 'FromModelToRegisterUserDto' ]);
		Aservice = new registerUserActionsService(httpClientSpy as any, mapperSpy as any);
	});

	it('should be created', () => {
		expect(Aservice).toBeTruthy();
	});

	it('Should register a user using http request', () => {
		localStorage.clear(); // clear local storage becouse if a user is already logged he cant register a new account
		const user = {
			email: 'email1@gmail.com',
			password: 'mypassword',
			name: 'name1',
			city: 'city',
			street: 'street',
			country: 'country',
			dateOfBirth: '1993-07-21'
		};
		let registerUserM: RegisterUser = RegisterUser.Create(user);

		const Result = {
			name: 'roger',
			email: 'email@gmail.com',
			password: 'password1',
			token: 'TOken',
			role: 'user'
		};

		httpClientSpy.post.and.returnValue(of(user));
		mapperSpy.FromModelToRegisterUserDto.and.returnValue(of(user));

		Aservice.registerUser(registerUserM).subscribe(
			(result) => expect(result).toEqual(user, 'expected registered user'),
			fail
		);
	});

	it('Should not register a user using http request error case 1', () => {
		// failed to register  server side (MDV)
		localStorage.clear();
		const user = {
			email: 'email1@gmail.com',
			password: 'mypassword',
			name: 'name1',
			city: 'city',
			street: 'street',
			country: 'country',
			dateOfBirth: '1993-07-21'
		};
		let registerUserM: RegisterUser = RegisterUser.Create(user);

		httpClientSpy.post.and.returnValue(throwError({ error: 'create dto fail failed' }));
		mapperSpy.FromModelToRegisterUserDto.and.returnValue(of(user));

		Aservice.registerUser(registerUserM).subscribe(
			(vts) => fail('expected an error, not an ok response '),
			(error) => {
				expect(error).toBeDefined();
			}
		);
	});
});
