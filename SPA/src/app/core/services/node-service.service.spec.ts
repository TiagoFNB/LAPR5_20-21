import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { NodeInterface } from 'src/app/shared/models/node/NodeInterface';
import { Node } from 'src/app/shared/models/node/Node';
import { NodeServiceService } from './node-service.service';
let createNodeSpy: { create: jasmine.Spy };
let httpClientSpy: { post: jasmine.Spy };
let Nservice: NodeServiceService;

describe('NodeService', () => {
	beforeEach(() => {
		//	createNodeSpy = jasmine.createSpyObj('Node', [ 'create' ]);
		httpClientSpy = jasmine.createSpyObj('HttpClient', [ 'post' ]);
		Nservice = new NodeServiceService(httpClientSpy as any);
	});

	it('should be created', () => {
		expect(Nservice).toBeTruthy();
	});

	it('Should create Node using http request', () => {
		const expectedN: NodeInterface = {
			name: 'nam1',
			shortName: 'shortName1',
			latitude: 40,
			longitude: 45,
			isDepot: 'true',
			isReliefPoint: 'true',
			crewTravelTimes: 10,
			crewTravelTimeReferenceNode: 'RefNode1'
		};

		let x = spyOn(Node, 'create').and.returnValue(expectedN);

		httpClientSpy.post.and.returnValue(of(expectedN));

		Nservice.registerNode(expectedN).subscribe((node) => expect(node).toEqual(expectedN, 'expected node'), fail);
	});

	it('should return an error when the node is not sucessfully created ', () => {
		const expectedN: NodeInterface = {
			name: 'nam1',
			shortName: 'shortName1',
			latitude: 40,
			longitude: 45,
			isDepot: 'true',
			isReliefPoint: 'true',
			crewTravelTimes: 10,
			crewTravelTimeReferenceNode: 'RefNode1'
		};

		let x = spyOn(Node, 'create').and.throwError(new Error('Error creating Node in test2'));
		httpClientSpy.post.and.returnValue(of(expectedN)); // this is to prove the mocks are working becouse if the above mocked method fails this mock wont even be called

		try {
			Nservice.registerNode(expectedN).subscribe(
				(node) => {
					fail('expected an error, not a node');
				},
				(error) => {
					fail('expected an error from creating model node, not a http error');
				}
			);
		} catch (error) {
			expect(error.message).toContain('Error creating Node in test2');
		}
	});

	it('should return an error when the server returns a 404', () => {
		const expectedN: NodeInterface = {
			name: 'nam1',
			shortName: 'shortName1',
			latitude: 40,
			longitude: 45,
			isDepot: 'true',
			isReliefPoint: 'true',
			crewTravelTimes: 10,
			crewTravelTimeReferenceNode: 'RefNode1'
		};

		const expectedResponse = new HttpErrorResponse({
			error: 'test 404 error',
			status: 404,
			statusText: 'Not Found'
		});

		httpClientSpy.post.and.returnValue(throwError(expectedResponse));

		Nservice.registerNode(expectedN).subscribe(
			(vts) => fail('expected an error, not a node'),
			(error) => {
				expect(error.error).toContain('test 404 error');
			}
		);
	});

	it('should return a custom error when the server returns a duplicate error message', () => {
		const expectedN: NodeInterface = {
			name: 'nam1',
			shortName: 'shortName1',
			latitude: 40,
			longitude: 45,
			isDepot: 'true',
			isReliefPoint: 'true',
			crewTravelTimes: 10,
			crewTravelTimeReferenceNode: 'RefNode1'
		};

		const expectedResponse = new HttpErrorResponse({
			error: 'E11000 duplicate',
			status: 404,
			statusText: 'Not Found'
		});

		httpClientSpy.post.and.returnValue(throwError(expectedResponse));

		Nservice.registerNode(expectedN).subscribe(
			(vts) => fail('expected an error, not a node'),
			(error) => {
				expect(error.error).toContain('E11000 duplicate');
			}
		);
	});
});
