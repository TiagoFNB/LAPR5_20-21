import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { string } from '@hapi/joi';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { LineInterface } from 'src/app/shared/models/Line/ILine';
import { Line } from 'src/app/shared/models/Line/Line';
import { Path } from 'src/app/shared/models/path/Path';
import { environment } from '../../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class LineActionsService {
	MDRURL = environment.MDRURL;
	constructor(private http: HttpClient) {}

	public registerLine(linePrototype: LineInterface): Observable<Line> {
		let lineObj = Line.create(linePrototype);

		const headers = { 'content-type': 'application/json' };
		const body = JSON.stringify(lineObj);

		//Communicated with the db to register a line
		return this.http.post<Line>(this.MDRURL + '/api/line', body, { headers: headers }).pipe(
			catchError((err) => {
				throw this.errorToConsumableState(err);
			})
		);
	}

	getListLines() {
		const headers = { 'content-type': 'application/json' };
		//Communicated with the db to register a line
		return this.http.get<Line[]>(this.MDRURL + '/api/line/listByQuery?sortBy=name', { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
	}

	/**
	 * Obtains the list of lines that include the given string in it's key
	 * 
	 * @param key line key partial string 
	 */
	getListLinesByName(key : string){

		if(key){
			const headers = { 'content-type': 'application/json' };
			//Communicated with the db to register a line
			return this.http.get<Line[]>(this.MDRURL + '/api/line/listByQuery?typeFilter=name&filter=' + key +'&sortBy=name', { headers: headers }).pipe(
				catchError((err) => {
					throw err;
				})
			);
		}
		
	}

	/**
   * Converts error messages to Consumer ready state
   */
	private errorToConsumableState(err: HttpErrorResponse): Error {
		let errorMsg = err.error;
		let readyErr = new Error();

		//Unless treated, the default error message received from MDR will be thrown,
		//here is the list of errors that do not need further processing:
		/*
			* Terminal Node does not exist
			* Driver type does not exist
			* Vehicle type does not exist
		*/
		readyErr.message = errorMsg;

		if (errorMsg.substring(0, 16) == 'E11000 duplicate') {
			readyErr.message = 'Submitted line code already exists.';
		} else if (errorMsg === 'child "code" fails because ["code" must only contain alpha-numeric characters]') {
			readyErr.message = 'Code must only contain alpha-numeric characters.';
		}

		return readyErr;
	}

	getPathsFromLine(lineId : string) : Observable<any> {
		const headers = { 'content-type': 'application/json' };

		let type : {
			key:string;
			paths:Path[];
		}
		return this.http.get<(typeof type)>(this.MDRURL + `/api/line/paths/` + lineId, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);

	}
	
}
