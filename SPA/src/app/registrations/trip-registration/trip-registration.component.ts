import { Component, OnInit } from '@angular/core';
import { LineActionsService } from 'src/app/core/services/line-actions/line-actions.service';
import { PathActionsService } from 'src/app/core/services/path-actions/path-actions.service';
import { TripActionsService } from 'src/app/core/services/trip-actions/trip-actions.service';
import { LineInterface } from 'src/app/shared/models/Line/ILine';
import { PathInterface } from 'src/app/shared/models/path/PathInterface';

@Component({
	selector: 'app-trip-registration',
	templateUrl: './trip-registration.component.html',
	styleUrls: ['./trip-registration.component.css']
})
export class TripRegistrationComponent implements OnInit {
	public selectedType: String;
	showhidepregnant: boolean;
	errorMessage: string;
	successMessage: string;

	public requestTrip = {
		pathId: undefined,
		lineId: undefined,
		startingTime: undefined,
		endingTime: undefined,
		frequency: undefined
	};
	public lines: LineInterface[] = [];
	public linesNames: string[];
	public lineNameSelected: string;

	public paths: PathInterface[] = [];
	public pathsID: string[];

	public frequency: number;

	constructor(
		private lineService: LineActionsService,
		private tripService: TripActionsService
	) { }

	ngOnInit(): void {

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

	getPathsFromSelectedLine() {
		this.requestTrip.lineId = this.lines.find(line => line.name == this.lineNameSelected).key;
		this.lineService.getPathsFromLine(this.requestTrip.lineId).subscribe(
			(data) => {
				this.paths = data.paths;

				this.pathsID = this.paths.map((element) => {
					return element.key;
				});
			},
			(error) => {
				this.handleErrors(error.error);
			}
		);
	}
	async onSubmit(form) {
		try {
			this.tripService.registerTrip(this.requestTrip).subscribe(
				(data) => {
					this.errorMessage = undefined;
					if (this.requestTrip.frequency == undefined || this.requestTrip.endingTime ==undefined) {
						this.successMessage = 'Trip created sucessfully';
					} else {
						this.successMessage = 'Trips created sucessfully';
					}
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

	resetElements(): void {
		this.requestTrip.endingTime = undefined;
		this.requestTrip.frequency = undefined;
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

}
