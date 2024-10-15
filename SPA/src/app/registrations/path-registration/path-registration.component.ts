import { Component, OnInit, ChangeDetectorRef, ViewChild, forwardRef } from '@angular/core';
import { PathInterface } from '../../shared/models/path/PathInterface';
import { LineInterface } from '../../shared/models/line/ILine';
import { PathActionsService } from '../../core/services/path-actions/path-actions.service';
import { LineActionsService } from '../../core/services/line-actions/line-actions.service';
import { NodeServiceService } from '../../core/services/node-service.service';
import { PathSegmentInterface } from 'src/app/shared/models/Path/PathSegment/PathSegmentInterface';
import { MatTable } from '@angular/material/table';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IfStmt } from '@angular/compiler';

@Component({
	selector: 'app-path',
	templateUrl: './path-registration.component.html',
	styleUrls: [ './path-registration.component.css' ]
})
export class PathRegistrationComponent implements OnInit {
	@ViewChild(MatTable, { static: false })
	table: MatTable<PathSegmentInterface>; // initialize
	displayedColumns: string[] = [ 'Position', 'node1', 'node2', 'duration', 'distance' ];
	deleteIndex: number;
	errorMessage: string;
	successMessage: string;

	public path = {
		key: undefined,
		line: undefined,
		type: undefined,
		pathSegments: undefined,
		isEmpty: undefined
	};

	public pathSegment: PathSegmentInterface = {
		node1: undefined,
		node2: undefined,
		duration: undefined,
		distance: undefined
	};

	pathSegmentsArray: PathSegmentInterface[] = [];
	public linesNames: string[];
	public lines: LineInterface[] = [];

	public pathKeys: string[];
	public types: string[];

	public nodesObjectForNode1: any[] = [];
	public nodesObjectForNode2: any[] = [];
	public nodesNames: any[];

	constructor(
		private pathService: PathActionsService,
		private lineService: LineActionsService,
		private nodeServiceService: NodeServiceService,
		private changeDetectorRefs: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.types = [ 'Go', 'Return', 'Reinforcement' ];

		//Obtain driver types from db
		this.lineService.getListLines().subscribe(
			(data) => {
				this.lines = data;
				this.linesNames = data.map((element) => {
					return element.name;
				});
			},
			(error) => {
				this.handleErrors(error.error);
			}
		);
	}

	async onSubmit(form) {
		try {
			this.path.pathSegments = this.pathSegmentsArray;
			let verifySameNameLine = false;
			if (this.lines) {
				for (let line of this.lines) {
					if (line.name == this.path.line) {
						this.path.line = line.key;
						break;
					}
				}
			}
			this.pathService.registerPath(this.path as PathInterface).subscribe(
				(data) => {
					this.errorMessage = undefined;
					this.successMessage = 'Path Created Sucessfully ';
					form.resetForm();
					return data;
				},
				(error) => {
					this.handleErrors(error.error);
					return error;
				}
			);
		} catch (err) {
			this.handleErrors(err.message);
			return err;
		}
	}

	handleErrors(error) {
		this.successMessage = undefined;

		if (error.substring(0, 16) == 'E11000 duplicate') {
			this.errorMessage = 'Error: That path identifier already exists in the system';
		} else if (error.includes('proxy')) {
			this.errorMessage = 'Error: could not connect to backend server';
		} else {
			this.errorMessage = error;
		}
	}

	DefinePathSegment() {
		try {
			this.validatePathSegmentsInput();
			let index;
			if (this.nodesObjectForNode1.length > 0) {
				index = 0;
				for (let node of this.nodesObjectForNode1) {
					index++;
					if (node.name == this.pathSegment.node1) {
						this.pathSegment.node1 = node.shortName;
					}
					if (index > 2) {
						this.handleErrors(
							'There are more then one node with same name in First Node, please write the short name instead'
						);
					}
				}
			}
			if (this.nodesObjectForNode2.length > 0) {
				index = 0;
				for (let node of this.nodesObjectForNode2) {
					index++;
					if (node.name == this.pathSegment.node2) {
						this.pathSegment.node2 = node.shortName;
					}
					if (index > 2) {
						this.handleErrors(
							'There are more then one node with same name in Second Node, please write the short name instead'
						);
					}
				}
			}

			this.pathSegmentsArray.push(this.pathSegment);
			this.table.renderRows();

			this.pathSegment = {
				node1: undefined,
				node2: undefined,
				duration: undefined,
				distance: undefined
			};
		} catch (err) {
			this.handleErrors(err.message);
		}
	}

	validatePathSegmentsInput() {
		if (
			this.pathSegment.node1 == undefined ||
			this.pathSegment.node2 == undefined ||
			this.pathSegment.duration == undefined ||
			this.pathSegment.distance == undefined ||
			this.pathSegment.node1 == '' ||
			this.pathSegment.node2 == '' ||
			this.pathSegment.duration == 0 ||
			this.pathSegment.distance == 0
		) {
			throw Error('Data is missing from path segments');
		}

		if (this.pathSegment.node1 == this.pathSegment.node2) {
			throw Error('Nodes of path segments cant be equal');
		}
	}

	ResetPathSegment() {
		this.table.renderRows();
		this.pathSegmentsArray = [];
	}

	DeletePathSegment() {
		this.table.renderRows();
		this.pathSegmentsArray.splice(this.deleteIndex, 1);
	}

	getNodesNamesForFirstNode() {
		if (this.pathSegment.node1) {
			this.nodeServiceService.getNodesByNames(this.pathSegment.node1).subscribe(
				(data) => {
					this.nodesObjectForNode1 = data;

					this.nodesNames = data.map((element) => {
						return element.name;
					});

				},
				(error) => {
					this.handleErrors(error.error);
				}
			);
			return this.nodesNames;
		}
	}

	getNodesNamesForSecondNode() {
		if (this.pathSegment.node2) {
			this.nodeServiceService.getNodesByNames(this.pathSegment.node2).subscribe(
				(data) => {
					this.nodesObjectForNode2 = data;

					this.nodesNames = data.map((element) => {
						return element.name;
					});

				},
				(error) => {
					this.handleErrors(error.error);
				}
			);
			return this.nodesNames;
		}
	}
}
