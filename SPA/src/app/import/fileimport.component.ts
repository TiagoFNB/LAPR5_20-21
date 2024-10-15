import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UploadService } from '../core/services/fileimport-actions/upload.service';

@Component({
	selector: 'app-fileimport',
	templateUrl: './fileimport.component.html',
	styleUrls: [ './fileimport.component.css' ]
})
export class FileImportComponent implements OnInit {
	selectedFiles: FileList;
	currentFile: File;
	progress = 0;
	message = '';
	errors;
	downloadableFileWithErrors: any;
	downloadJsonHref;
	loading: boolean;
	private setting = {
		element: {
			dynamicDownload: null as HTMLElement
		}
	};

	constructor(private uploadService: UploadService) {}

	ngOnInit(): void {}

	uploadFile(): void {
		this.loading = true;
		this.message = 'This can take a while';
		this.progress = 0;
		this.currentFile = this.selectedFiles.item(0);
		console.log('willstart');
		console.log(this.currentFile);
		this.uploadService.upload(this.currentFile).subscribe(
			(event) => {
				this.loading = false;
				console.log('check1');
				console.log(event);
				if (event[0].type === HttpEventType.UploadProgress) {
					this.progress = Math.round(100 * event[0].loaded / event[0].total);
				} else if (event[0] instanceof HttpResponse) {
					let t1 = event[0].body.errors;
					let t2 = event[0].body.errors.length;
					let t3 = event[1].body.errorList;
					let t4 = event[1].body.errorList.length;
					let numberOfErrors: number = event[0].body.errors.length + event[1].body.errorList.length;

					this.message = 'File was imported and there was ' + numberOfErrors + ' errors';
					if (numberOfErrors > 0) {
						this.downloadableFileWithErrors = {
							FromMDR: event[0].body.errors,
							FromMDV: event[1].body.errorList
						};

						this.errors = 'File was uploaded but there were some errors, download the file to check them';
					} else {
						this.errors = 'File was uploaded without any error';
					}
				}
			},
			(err) => {
				this.loading = false;
				this.progress = 0;
				if (err.error.message) {
					this.handleErrors(err.error.message);
					this.currentFile = undefined;
				} else {
					this.handleErrors(err.error);
				}
			}
		);
		this.selectedFiles = undefined;
	}

	downloadJson() {
		var sJson = JSON.stringify(this.downloadableFileWithErrors, null, '\t');
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
		element.setAttribute('download', 'errors.json');
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click(); // simulate click
		document.body.removeChild(element);
	}

	// dynamicDownloadTxt() {
	// 	this.dyanmicDownloadByHtmlTag({
	// 		fileName: 'Errors',
	// 		text: this.downloadableFileWithErrors
	// 	});
	// }
	// dynamicDownloadJson() {
	// 	this.dyanmicDownloadByHtmlTag({
	// 		fileName: 'Errors.json',
	// 		text: this.downloadableFileWithErrors
	// 	});
	// }

	// private dyanmicDownloadByHtmlTag(arg: { fileName: string; text: string }) {
	// 	if (!this.setting.element.dynamicDownload) {
	// 		this.setting.element.dynamicDownload = document.createElement('a');
	// 	}
	// 	const element = this.setting.element.dynamicDownload;
	// 	const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
	// 	element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
	// 	element.setAttribute('download', arg.fileName);

	// 	var event = new MouseEvent('click');
	// 	element.dispatchEvent(event);
	// }

	handleErrors(error) {
		console.log('Error--');
		console.log(error);
		if (error.includes('proxy')) {
			this.message = 'Error: could not connect to backend server';
		} else {
			this.message = error;
		}
	}

	selectFile(event) {
		let files = event.target.files;

		if (!this.validateFile(files[0].name)) {
			this.currentFile = undefined;
			this.message = 'File extension not supported! Please insert a .glx or .xml file!';
		} else {
			this.selectedFiles = files;
		}
	}

	validateFile(name: String) {
		var ext = name.substring(name.lastIndexOf('.') + 1);
		if (ext.toLowerCase() == 'xml') {
			return true;
		}
		if (ext.toLowerCase() == 'glx') {
			return true;
		} else {
			return false;
		}
	}
}
