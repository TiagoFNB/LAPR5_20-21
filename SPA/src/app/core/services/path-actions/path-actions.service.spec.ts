import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { PathInterface } from 'src/app/shared/models/path/PathInterface';
import { PathSegmentInterface } from 'src/app/shared/models/Path/PathSegment/PathSegmentInterface';
import { Path } from 'src/app/shared/models/path/Path';
import { PathActionsService } from './path-actions.service';
import { PathSegment } from 'src/app/shared/models/Path/PathSegment/PathSegment';

let createPathSpy: { create: jasmine.Spy };
let httpClientSpy: { post: jasmine.Spy };
let pathService: PathActionsService;

describe('PathService', () => {
	beforeEach(() => {
		//	createNodeSpy = jasmine.createSpyObj('Node', [ 'create' ]);
		httpClientSpy = jasmine.createSpyObj('HttpClient', [ 'post' ]);
		pathService = new PathActionsService(httpClientSpy as any);
	});

	it('should be created', () => {
		expect(pathService).toBeTruthy();
	});

	it('Should create Path using http request', () => {

        const expectedPathSegment: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }

        const expectedPathSegment2: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }

        // let pathSegArray : PathSegmentInterface[];
        // pathSegArray.push(expectedPathSegment);
        // pathSegArray.push(expectedPathSegment2);


		const expectedPath: PathInterface = {
			key: 'nam1',
			line: 'line1',
            type: 'Go',
            pathSegments: [expectedPathSegment,expectedPathSegment2],
			isEmpty:true
        };
        

		let x = spyOn(Path, 'create').and.returnValue(expectedPath);

		httpClientSpy.post.and.returnValue(of(expectedPath));

		pathService.registerPath(expectedPath).subscribe((path) => expect(path).toEqual(expectedPath, 'expected node'), fail);
	});

	it('should return an error when the path is not sucessfully created ', () => {
		const expectedPathSegment: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }

        const expectedPathSegment2: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }

        // let pathSegArray : PathSegmentInterface[];
        // pathSegArray.push(expectedPathSegment);
        // pathSegArray.push(expectedPathSegment2);


		const expectedPath: PathInterface = {
			key: 'nam1',
			line: 'line1',
            type: 'Go',
            pathSegments: [expectedPathSegment,expectedPathSegment2],
			isEmpty:true
        };

		let x = spyOn(Path, 'create').and.throwError(new Error('Error creating Path in test2'));

		httpClientSpy.post.and.returnValue(of(expectedPath)); // this is to prove the mocks are working becouse if the above mocked method fails this mock wont even be called


		try {
			pathService.registerPath(expectedPath).subscribe(
				(path) => {
					fail('expected an error, not a node');
				},
				(error) => {
					fail('expected an error from creating model path, not a http error');
				}
			);
		} catch (error) {
			expect(error.message).toContain('Error creating Path in test2');
		}
	});

	it('should return an error when the server returns a 404', () => {
		const expectedPathSegment: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }

        const expectedPathSegment2: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }

        // let pathSegArray : PathSegmentInterface[];
        // pathSegArray.push(expectedPathSegment);
        // pathSegArray.push(expectedPathSegment2);


		const expectedPath: PathInterface = {
			key: 'nam1',
			line: 'line1',
            type: 'Go',
            pathSegments: [expectedPathSegment,expectedPathSegment2],
			isEmpty:true
        };

		const expectedResponse = new HttpErrorResponse({
			error: 'test 404 error',
			status: 404,
			statusText: 'Not Found'
		});

		httpClientSpy.post.and.returnValue(throwError(expectedResponse));

		pathService.registerPath(expectedPath).subscribe(
			(vts) => fail('expected an error, not a node'),
			(error) => {
				expect(error.error).toContain('test 404 error');
			}
		);
	});

	it('should return a custom error when the server returns a duplicate error message', () => {
		const expectedPathSegment: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }

        const expectedPathSegment2: PathSegmentInterface = {
            node1:'yo',
            node2:'yo2',
            duration:5,
            distance:5,
        }

        // let pathSegArray : PathSegmentInterface[];
        // pathSegArray.push(expectedPathSegment);
        // pathSegArray.push(expectedPathSegment2);


		const expectedPath: PathInterface = {
			key: 'nam1',
			line: 'line1',
            type: 'Go',
            pathSegments: [expectedPathSegment,expectedPathSegment2],
			isEmpty:true
        };

		const expectedResponse = new HttpErrorResponse({
			error: 'E11000 duplicate',
			status: 404,
			statusText: 'Not Found'
		});

		httpClientSpy.post.and.returnValue(throwError(expectedResponse));

		pathService.registerPath(expectedPath).subscribe(
			(vts) => fail('expected an error, not a node'),
			(error) => {
				expect(error.error).toContain('E11000 duplicate');
			}
		);
	});
});
