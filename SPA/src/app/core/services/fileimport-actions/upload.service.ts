import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { environment } from '../../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class UploadService {
	MDRURL = environment.MDRURL;
	MDVURL = environment.MDVURL;
	constructor(private http: HttpClient) {}

	upload(file: File): Observable<any[]> {
		const formData: FormData = new FormData();

		formData.append('xml', file, file.name);

		const formDataMDV: FormData = new FormData();

		formDataMDV.append('file', file, file.name);

		const reqMDV = new HttpRequest('POST', `${this.MDVURL}/mdvapi/ImportGlx`, formDataMDV, {
			reportProgress: true,
			responseType: 'json'
		});

		const reqMDR = new HttpRequest('POST', `${this.MDRURL}/api/fileupload`, formData, {
			reportProgress: true,
			responseType: 'json'
		});

		var MDRupload = this.http.request(reqMDR).pipe(
			catchError((err) => {
				throw err;
			})
		);

		var MDVupload = this.http.request(reqMDV);

		return forkJoin([ MDRupload, MDVupload ]);
	}
}
