import { Injectable } from '@angular/core';
import { PathInterface } from 'src/app/shared/models/path/PathInterface';
import { Path } from 'src/app/shared/models/path/Path';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { PathSegmentInterface } from 'src/app/shared/models/path/PathSegment/PathSegmentInterface';
import { environment } from '../../../../environments/environment';
@Injectable({
	providedIn: 'root'
})
export class PathActionsService {
	MDRURL = environment.MDRURL;

	constructor(private http: HttpClient) {}

	registerPath(pathPrototype: PathInterface): Observable<Path> {
		let path: Path = Path.create(pathPrototype);
		const headers = { 'content-type': 'application/json' };
		const body = JSON.stringify(path);
		return this.http.post<PathInterface>(this.MDRURL + '/api/path/register', body, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
	}

	getAllPaths() {
		const headers = { 'content-type': 'application/json' };
		return this.http.get<Path[]>(this.MDRURL + `/api/path`, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
	}
}
