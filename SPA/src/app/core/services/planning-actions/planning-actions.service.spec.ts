import { throwError } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';

import { PlanningActionsService } from './planning-actions.service';

let httpClientSpyForPlaningService: { post: jasmine.Spy };

let Pservice: PlanningActionsService;

describe('Planing Service', () => {
	beforeEach(() => {
		//	createNodeSpy = jasmine.createSpyObj('Node', [ 'create' ]);

		httpClientSpyForPlaningService = jasmine.createSpyObj('HttpClient', [ 'post' ]);
		Pservice = new PlanningActionsService(httpClientSpyForPlaningService as any);
	});

	it('should be created', () => {
		expect(Pservice).toBeTruthy();
	});

	it('Should obtain results from prolog server ', () => {
		let expRes = [
			{
				Time: 200,
				Path: [ 'Uno', 'Dos', 'Tres' ],
				Lines: [ 'LUno', 'LDos', 'LTres' ]
			},
			{
				Time: 300,
				Path: [ 'Uno', 'Qatro', 'Tres' ],
				Lines: [ 'LUno', 'LDos', 'LTres' ]
			}
		];

		httpClientSpyForPlaningService.post.and.returnValue(of(expRes));

		Pservice.sendAlgorithmRequest('A*', 'Uno', 'LTres', 10, 10).subscribe((result) =>
			expect(result).toEqual(expRes)
		);
	});

	it('Should Not obtain results from prolog server due to bad connection to server', () => {
		httpClientSpyForPlaningService.post.and.returnValue(throwError('error server not found'));

		Pservice.sendAlgorithmRequest('A*', 'Uno', 'LTres', 10, 10).subscribe(
			(result) => expect(1).toEqual(2), // should fail if it enters here
			(error) => {
				expect(error).toEqual('error server not found');
			}
		);
	});

	it('Should obtain results from prolog server and convert response to UI for A* algorithm ', () => {
		let convertedResult;
		let expRes = {
			tempo: 200,
			caminho: [ 'Uno', 'Dos', 'Tres' ],
			percursos: [ 'LUno', 'LDos', 'LTres' ]
		};

		httpClientSpyForPlaningService.post.and.returnValue(of(expRes));

		Pservice.sendAlgorithmRequest('A*', 'Uno', 'LTres', 10, 10).subscribe((result) => {
			expect(result).toEqual(expRes);

			convertedResult = Pservice.convertToUiResponseForAStartAndBestFirst(result);
		});
		expect(convertedResult).toEqual([ { nodes: 'Uno-Dos-Tres', paths: 'LUno-LDos-LTres', time: '00:03:20' } ]);
	});

	it('Should obtain results from prolog server and convert response to UI for BestFirst algorithm ', () => {
		let convertedResult;
		let expRes = {
			tempo: 200,
			caminho: [ 'Uno', 'Dos', 'Tres' ],
			percursos: [ 'LUno', 'LDos', 'LTres' ]
		};

		httpClientSpyForPlaningService.post.and.returnValue(of(expRes));

		Pservice.sendAlgorithmRequest('BestFirst', 'Uno', 'LTres', 10, 10).subscribe((result) => {
			expect(result).toEqual(expRes);

			convertedResult = Pservice.convertToUiResponseForAStartAndBestFirst(result);
		});
		expect(convertedResult).toEqual([ { nodes: 'Uno-Dos-Tres', paths: 'LUno-LDos-LTres', time: '00:03:20' } ]);
	});

	it('Should obtain results from prolog server and convert response to UI for Generator of all solutions algorithm ', () => {
		let convertedResult;
		let expRes = {
			tempo: 200,
			caminho: [ { no1: 'uno', no2: 'uno2', path: 1 } ]
		};

		httpClientSpyForPlaningService.post.and.returnValue(of(expRes));

		Pservice.sendAlgorithmRequest('GeneratorAllSolutions', 'Uno', 'LTres', 10, 10).subscribe((result) => {
			expect(result).toEqual(expRes);

			convertedResult = Pservice.convertToUiResponseToGeneratorOfAllSolutionsAlgoritm(result);
		});
		expect(convertedResult).toEqual([ { nodes: 'uno, uno2', path: '1', time: 200 } ]);
	});
});
