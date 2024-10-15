import { Component, OnInit, ɵConsole } from '@angular/core';
import { NodeServiceService } from '../core/services/node-service.service';
import { PlanningActionsService } from '../core/services/planning-actions/planning-actions.service';
import { WorkblockActionsService } from '../core/services/workblock-actions/workblock-actions.service';
import { AffectDriverDutiesDtoFromPlanning } from '../shared/models/Planning/AffectDriverDuties/AffectDriverDutiesDtoFromPlanning';
import { ObtainWorkBlocksByIdDto } from '../shared/models/WorkBlock/Dto/ObtainWorkBlocksByIdDto';

@Component({
	selector: 'app-planning',
	templateUrl: './planning.component.html',
	styleUrls: [ './planning.component.css' ]
})
export class PlanningComponent implements OnInit {
	public loading;
	public persistloading;
	public selectedAlgorithm: String;
	AstarColumns: string[] = [ 'Time', 'Nodes', 'Paths' ];
	GeneratorAllColumns: string[] = [ 'Nodes', 'Path', 'Time' ];
	BestFirstColumns: string[] = [ 'Nodes', 'Paths', 'ArraivalTime' ];
	GeneticColumns: string[] = [ 'Drivers', 'WorkBlocks' ];
	AffectDriversColumns: string[] = [ 'Drivers', 'WorkBlocks' ];

	public errorMessage: String;
	public successMessage: String;
	//Form inputs
	public start;
	public destination;
	public hour: number;
	public minute: number;
	public mdvErrorLogBoolean: boolean;
	public mdvErrorLog: any;
	//Genetic algorithm variables
	public vehicleDutyId: string;
	public maxDuration: number;
	public affectDriversDate: string;
	public workBlocksOfVehicleDuty;
	public errorLog;
	public resultFromAffectDriversGenetic;
	//AffectDrivers algorithm variables
	public date: string;

	public results; //Shared
	public allowSaveResult: boolean;
	//Node list
	public nodesListforStartPoint: any[];
	public nodesListforDestinationPoint: any[];

	public nodesNamesListforStartPoint: string[] = [];
	public nodesNamesListforDestinationPoint: string[] = [];

	constructor(
		private planningService: PlanningActionsService,
		private nodeService: NodeServiceService,
		private workBlockService: WorkblockActionsService
	) {}

	public onCalculateAffectDrivers(form) {}

	obtainNodesSugestionForStartPoint() {
		if (this.start != undefined && this.start != '') {
			this.nodeService.getNodesByNames(this.start).subscribe(
				(data) => {
					this.nodesListforStartPoint = data;

					this.nodesNamesListforStartPoint = data.map((element) => {
						return element.name;
					});
				},
				(error) => {
					this.handleErrors(error.error);
				}
			);
			return this.nodesNamesListforStartPoint;
		}
	}
	obtainNodesSugestionForDestinationPoint() {
		if (this.destination != undefined && this.destination != '') {
			this.nodeService.getNodesByNames(this.destination).subscribe(
				(data) => {
					this.nodesListforDestinationPoint = data;

					this.nodesNamesListforDestinationPoint = data.map((element) => {
						return element.name;
					});
				},
				(error) => {
					this.handleErrors(error.error);
				}
			);
			return this.nodesListforDestinationPoint;
		}
	}

	ngOnInit(): void {
		this.selectedAlgorithm = 'GeneratorAllSolutions';
		this.results = [];
		this.loading = false;
	}

	resetList(): void {
		this.errorMessage = undefined;
		this.results = [];
	}

	obtainVehicleDutySuggestions() {
		//TODO - obtain vehicle duty suggestions from MDV
	}
	AffectDrivers() {
		this.persistloading = true;
		try {
			this.planningService.persisteGaResult(this.resultFromAffectDriversGenetic).subscribe(
				(data: any[]) => {
					this.mdvErrorLogBoolean = true;
					this.mdvErrorLog = data;
				},
				(error) => {
					this.errorMessage =
						'No Driver Duty could be affected, probably all workblocks are already affected';
					this.persistloading = false;
				}
			);
		} catch (err) {
			this.errorMessage = err.message;
			this.persistloading = false;
		}
	}

	//Form submittal function for genetic algorithm
	async onCalculateGenetic(form) {
		this.loading = true;
		this.errorMessage = undefined;
		try {
			this.planningService.sendGeneticAlgorithmRequest(this.vehicleDutyId, this.maxDuration).subscribe(
				(data) => {
					this.obtainWorkBlocksOfVehicleDuty(data);

					form.resetForm();
				},
				(error) => {
					this.errorMessage = "Error: Could not calculate given vehicle duty's workblock allocations.";
					this.loading = false;
				}
			);
		} catch (err) {
			this.errorMessage = err.message;
			this.loading = false;
		}
	}

	async onCalculateGeneticAffectDrivers(form) {
		console.log('ENTROU');
		this.loading = true;
		this.errorMessage = undefined;
		console.log('data');
		console.log(this.affectDriversDate);
		try {
			this.planningService.sendAffectDriversGeneticAlgorithmRequest(this.affectDriversDate).subscribe(
				(data: AffectDriverDutiesDtoFromPlanning) => {
					this.resultFromAffectDriversGenetic = data;
					//	this.obtainWorkBlocksOfVehicleDuty(data);
					console.log('CHECK HERE!');
					console.log(data);
					form.resetForm();
					console.log('1 ELEM DA LISTA');
					console.log(data.lista[0]);

					this.obtainWorkBlocksOfDriverDuties(data);

					this.loading = false;
				},
				(error) => {
					this.errorMessage = 'Error in planning: Probably there are no Drivers in the system';
					this.loading = false;
				}
			);
		} catch (err) {
			this.errorMessage = err.message;
			this.loading = false;
		}
	}

	obtainWorkBlocksOfDriverDuties(planningResults: AffectDriverDutiesDtoFromPlanning) {
		try {
			let tamanhoLista = planningResults.lista.length;
			let wbId: ObtainWorkBlocksByIdDto = new ObtainWorkBlocksByIdDto();
			for (let i = 0; i < tamanhoLista; i++) {
				console.log('ENTROU 1');
				planningResults.lista[i].workBlockDurationList = [ undefined ]; // required to inicialize list
				//	let wbIds: ObtainWorkBlocksByIdDto[] =  ObtainWorkBlocksByIdDto[];
				let wbIds = [ new ObtainWorkBlocksByIdDto() ];
				let tamanhoListaWb = planningResults.lista[i].workBlockList.length;

				for (let u = 0; u < tamanhoListaWb; u++) {
					let wbId: ObtainWorkBlocksByIdDto = new ObtainWorkBlocksByIdDto();
					wbId.code = planningResults.lista[i].workBlockList[u];

					wbIds.push(wbId);
				}
				console.log('OBJECTS SENDING TO SERVICE');
				console.log(wbIds);
				this.workBlockService.obtainWorkBlocksById(wbIds).subscribe(
					(data: any[]) => {
						planningResults.lista[i].workBlockDurationList.pop(); // to remove the undefined setted above
						for (let k = 0; k < data.length; k++) {
							let tr = {
								Ti: new Date(data[k].startTime * 1000).toISOString().substr(11, 8),
								Tf: new Date(data[k].endTime * 1000).toISOString().substr(11, 8)
							};

							planningResults.lista[i].workBlockDurationList.push(tr);
							planningResults.lista[i].workBlockDurationList.sort((a, b) => (a.Ti < b.Ti ? -1 : 1));
						}

						this.results = this.planningService.convertToUiResponseToAffectAllDriversGenetic(
							planningResults
						);
						this.errorLog = planningResults.listaError;
						this.allowSaveResult = true;
					},
					(error) => {
						this.allowSaveResult = false;
						this.errorMessage =
							'Unexpected error, information in planning is not in sync with information in database';
						this.loading = false;
					}
				);
			}
		} catch (error) {
			this.errorMessage = error.message;
			this.loading = false;
			this.allowSaveResult = false;
		}
	}

	downloadErrorsFromMdvJson() {
		var sJson = JSON.stringify(this.mdvErrorLog, null, '\t');
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
		element.setAttribute('download', 'errors.json');
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click(); // simulate click
		document.body.removeChild(element);
	}

	downloadErrorsFromPlanningJson() {
		var sJson = JSON.stringify(this.errorLog, null, '\t');
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
		element.setAttribute('download', 'errors.json');
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click(); // simulate click
		document.body.removeChild(element);
	}

	obtainWorkBlocksOfVehicleDuty(planningResults: any) {
		try {
			this.workBlockService.obtainWorkBlocksOfVehicleDuty(this.vehicleDutyId).subscribe(
				(data) => {
					try {
						this.workBlocksOfVehicleDuty = data;
						this.results = this.planningService.convertToUiResponseToGenetic(planningResults, data);
					} catch (error) {
						this.errorMessage =
							'Error: Internal error ocurred: Workblock number used by the algorithm does not match the current number of workblocks in DB.';
					}
					this.loading = false;
				},
				(error) => {
					this.errorMessage =
						'Error: Internal error ocurred: Workblock number used by the algorithm does not match the current number of workblocks in DB.';
					this.loading = false;
				}
			);
		} catch (error) {
			this.errorMessage = error.message;
			this.loading = false;
		}
	}

	onCalculate(form) {
		this.loading = true;
		//Reset error message
		this.errorMessage = undefined;

		//convert names to shortnames
		if (this.nodesListforStartPoint) {
			for (let node of this.nodesListforStartPoint) {
				if (node.name == this.start) {
					this.start = node.shortName;
				}
			}
		}

		if (this.nodesListforDestinationPoint) {
			for (let node of this.nodesListforDestinationPoint) {
				if (node.name == this.destination) {
					this.destination = node.shortName;
				}
			}
		}
		this.planningService
			.sendAlgorithmRequest(this.selectedAlgorithm, this.start, this.destination, this.hour, this.minute)
			.subscribe(
				(data) => {
					if (this.selectedAlgorithm == 'GeneratorAllSolutions') {
						this.results = this.planningService.convertToUiResponseToGeneratorOfAllSolutionsAlgoritm(data);
					} else {
						this.results = this.planningService.convertToUiResponseForAStartAndBestFirst(data);
					}
					this.loading = false;
					form.resetForm();
				},
				(error) => {
					this.loading = false;
					this.handleErrors(error.error);
				}
			);
	}

	handleErrors(error) {
		if (error.includes('proxy')) {
			this.errorMessage = 'Error: could not connect to backend server';
		} else {
			this.errorMessage = error;
		}
	}
}
