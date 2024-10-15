import { UploadService } from './../core/services/fileimport-actions/upload.service';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { AppRoutingModule } from '../app-routing.module';

import { FileImportComponent } from './fileimport.component';
import { of } from 'rxjs';

describe('FileImportComponent', () => {
	let component: FileImportComponent;
	let fixture: ComponentFixture<FileImportComponent>;
	let testBed;
	let uploadMock = jasmine.createSpyObj(UploadService, [ 'upload' ]);

	beforeEach(async () => {
		testBed = await TestBed.configureTestingModule({
			declarations: [ FileImportComponent ],
			providers: [ { provide: UploadService, useValue: uploadMock } ],
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

	it('should receive response with message', async () => {
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

		let init = { body: expectedR };
		let httpRes = new HttpResponse<unknown>(init);

		const expectedRMDV = { message: 'file is uploaded', errorList: [] };

		let initMdv = { body: expectedRMDV };
		let httpResMdv = new HttpResponse<unknown>(initMdv);
		uploadMock.upload.and.returnValue(of([ httpRes, httpResMdv ]));

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

		const expectedR = { status: 'A', message: 'file is uploaded', errors: [ 'error 1' ] };

		const expectedRMDV = { message: 'file is uploaded', errorList: [ 'errormdv1' ] };

		let initMdv = { body: expectedRMDV };
		let httpResMdv = new HttpResponse<unknown>(initMdv);

		let init = { body: expectedR };
		let httpRes = new HttpResponse<unknown>(init);
		uploadMock.upload.and.returnValue(of([ httpRes, httpResMdv ]));

		fixture = TestBed.createComponent(FileImportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.selectedFiles = fileList;

		component.uploadFile();

		expect(component.message).toEqual('File was imported and there was ' + 2 + ' errors');
	});
});
