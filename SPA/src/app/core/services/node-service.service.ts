import { Injectable } from '@angular/core';
import { NodeInterface } from 'src/app/shared/models/node/NodeInterface';
import { Node } from 'src/app/shared/models/node/Node';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class NodeServiceService {
	private node: Node;
	private nodeShortName;
	private errorMessage;
	MDRURL = environment.MDRURL;

	constructor(private http: HttpClient) {}

	registerNode(nodePrototype: NodeInterface): Observable<Node> {
		this.node = Node.create(nodePrototype);

		let headers = { 'content-type': 'application/json' };

		const body = JSON.stringify(this.node);
		return this.http.post<Node>(this.MDRURL + '/api/node', body, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
	}

	public err() {
		throw new Error('');
	}

	public getNodesByNames(keys: string) {
		if (keys) {
			const headers = { 'content-type': 'application/json' };

			return this.http
				.get<Node[]>(this.MDRURL + `/api/node/listByQuery?filterby=name&filtertype=${keys}&sortby=name`, {
					headers: headers
				})
				.pipe(
					catchError((err) => {
						throw err;
					})
				);
		}
	}

	public getAllNodes() {
		const headers = { 'content-type': 'application/json' };

		return this.http.get<Node[]>(this.MDRURL + `/api/node/listByQuery?sortby=name`, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
	}
}
