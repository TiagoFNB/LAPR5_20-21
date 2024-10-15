import { HttpErrorResponse, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';

import { UploadService } from './upload.service';

describe('UploadService', () => {
	let service: UploadService;
	let httpClientSpy: { request: jasmine.Spy };
	beforeEach(() => {
		// TODO: spy on other methods too
		httpClientSpy = jasmine.createSpyObj('HttpClient', [ 'request' ]);

		service = new UploadService(httpClientSpy as any);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('Should get response  using http request', () => {
		const expectedR = { status: 'A', message: 'file is uploaded', errors: {} };
		let mockFile = new File([], 'fich');
		let init = { body: expectedR };
		let httpRes = new HttpResponse<unknown>(init);

		httpClientSpy.request.and.returnValue(of(httpRes));

		service.upload(mockFile).subscribe((vts) => expect(vts[0]).toEqual(httpRes, 'expected response'), fail);
	});

	it('should return an error when the server returns a 404', () => {
		const expectedR = [ { status: 'A', message: 'file is uploaded', errors: {} } ];
		let mockFile = new File([], 'fich');

		const expectedResponse = new HttpErrorResponse({
			error: 'test 404 error',
			status: 404,
			statusText: 'Not Found'
		});

		httpClientSpy.request.and.returnValue(throwError(expectedResponse));

		service.upload(mockFile).subscribe(
			(vts) => {
				fail('expected an error');
			},
			(error) => {
				expect(error.error).toContain('test 404 error');
			}
		);
	});
});
