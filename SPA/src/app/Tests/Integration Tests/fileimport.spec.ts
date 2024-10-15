import { UploadService } from '../../core/services/fileimport-actions/upload.service';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { AppRoutingModule } from '../../app-routing.module';

import { FileImportComponent } from './../../import/fileimport.component';
import { of, throwError } from 'rxjs';

describe('FileImport Integration Tests', () => {
	let component: FileImportComponent;
	let fixture: ComponentFixture<FileImportComponent>;
	let testBed;
	let service: UploadService;

	let httpClientSpy;

	beforeEach(async () => {
		httpClientSpy = jasmine.createSpyObj('HttpClient', [ 'request' ]);

		service = new UploadService(httpClientSpy as any);

		testBed = await TestBed.configureTestingModule({
			declarations: [ FileImportComponent ],
			providers: [ { provide: UploadService, useValue: service } ],
			imports: [
				BrowserModule,
				AppRoutingModule,
				FormsModule,
				ColorPickerModule,
				MatSelectModule,
				HttpClientModule,
				BrowserAnimationsModule,
				MatGridListModule
			]
		}).compileComponents();
	});

	it('should create', () => {
		fixture = TestBed.createComponent(FileImportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should receive response with message', () => {
		const blob = new Blob([ '' ], { type: 'text/xml' });
		blob['lastModifiedDate'] = '';
		blob['name'] = 'filename';
		const file = <File>blob;
		const fileList = {
			0: file,
			1: file,
			length: 2,
			item: (index: number) => file
		};

		const expectedR = { status: 'A', message: 'file is uploaded', errors: [], errorList: [] };

		let init = { body: expectedR };
		let httpRes = new HttpResponse<unknown>(init);

		httpClientSpy.request.and.returnValue(of(httpRes));

		fixture = TestBed.createComponent(FileImportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.selectedFiles = fileList;

		component.uploadFile();

		expect(component.message).toEqual('File was imported and there was ' + 0 + ' errors');
	});

	it('should receive response with message, second case (error array has items)', () => {
		const blob = new Blob([ '' ], { type: 'text/xml' });
		blob['lastModifiedDate'] = '';
		blob['name'] = 'filename';
		const file = <File>blob;
		const fileList = {
			0: file,
			1: file,
			length: 2,
			item: (index: number) => file
		};

		const expectedR = { status: 'A', message: 'file is uploaded', errors: [ 'error 1' ], errorList: [ 'error2' ] };
		let init = { body: expectedR };
		let httpRes = new HttpResponse<unknown>(init);

		httpClientSpy.request.and.returnValue(of(httpRes));

		fixture = TestBed.createComponent(FileImportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.selectedFiles = fileList;

		component.uploadFile();

		expect(component.message).toEqual('File was imported and there was ' + 2 + ' errors');
	});

	it('should receive response with message, second case (error from server)', () => {
		const blob = new Blob([ '' ], { type: 'text/xml' });
		blob['lastModifiedDate'] = '';
		blob['name'] = 'filename';
		const file = <File>blob;
		const fileList = {
			0: file,
			1: file,
			length: 2,
			item: (index: number) => file
		};

		const expectedR = { status: 'A', message: 'file is uploaded', errors: [] };
		expectedR.errors.push('error 1');
		let init = { body: expectedR };
		let httpRes = new HttpResponse<unknown>(init);

		httpClientSpy.request.and.returnValue(throwError({ error: 'proxy' }));

		fixture = TestBed.createComponent(FileImportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.selectedFiles = fileList;

		component.uploadFile();

		expect(component.message).toEqual('Error: could not connect to backend server');
	});
});
