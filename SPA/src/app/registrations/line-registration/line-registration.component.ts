import { Component, OnInit } from '@angular/core';
import { DriverTypeActionsService } from 'src/app/core/services/driverType-actions/driver-type-actions.service';
import { LineActionsService } from 'src/app/core/services/line-actions/line-actions.service';
import { NodeServiceService } from 'src/app/core/services/node-service.service';
import { VehicleTypeActionsService } from 'src/app/core/services/vehicleType-actions/vehicle-type-actions.service';

@Component({
	selector: 'app-line-registration',
	templateUrl: './line-registration.component.html',
	styleUrls: [ './line-registration.component.css' ]
})
export class LineRegistrationComponent implements OnInit {
	public line = {
		// object of the same type as Node with default values
		key: undefined,
		name: undefined,
		RGB: {
			red: 0,
			green: 0,
			blue: 0
		},
		terminalNode1: undefined,
		terminalNode2: undefined,
		AllowedDrivers: [],
		AllowedVehicles: []
	};
	//Receives the node names list from the database
	public nodesObjinDBforTermianl1: any[] = [];
	//Receives the node names list from the database
	public nodesObjinDBforTermianl2: any[] = [];
	//Receives the node names list from the database
	public nodesInDB: string[];

	//Receives the driver types names list from the database
	public driverTypes: string[];

	//Receives the vehicle types names list from the database
	public vehicleTypes: string[];

	//Feedback messages
	public successMessage: string;
	public errorMessage: string;

	//An unformatted RGB is received from the form and held in this variable
	public unformattedRGB: string;

	constructor(
		private lineService: LineActionsService,
		private nodeService: NodeServiceService,
		private driverTypeService: DriverTypeActionsService,
		private vehicleTypeService: VehicleTypeActionsService
	) {}

	ngOnInit(): void {
		//Default starting color is white
		this.unformattedRGB = 'rgb(0,0,0)'; 

		//Obtain driver types from db
		this.driverTypeService.getDriverTypes().subscribe(
			(data) => {
				this.driverTypes = data.map((element) => {
					return element.name;
				});
			},
			(error) => {
				this.driverTypes = [ 'Error obtaining driver types.' ];
			}
		);

		//Obtain vehicle types from db
		this.vehicleTypeService.getVehicleTypes().subscribe(
			(data) => {
				this.vehicleTypes = data.map((element) => {
					return element.name;
				});
			},
			(error) => {
				this.vehicleTypes = [ 'Error obtaining vehicle types.' ];
			}
		);
	}
	// method called by (keyup) event when something is typed in terminalnode1
	nodesInDBMethodforTermianlNode1() {
		//Obtain nodes from db
		this.nodeService.getNodesByNames(this.line.terminalNode1).subscribe(
			(data) => {
				this.nodesObjinDBforTermianl1 = data;
				this.nodesInDB = data.map((element) => {
					return element.name;
				});
			},
			(error) => {
				this.nodesInDB = [ 'Error obtaining nodes.' ];
			}
		);
	}
	// method called by (keyup) event when something is typed in terminalnode2
	nodesInDBMethodforTermianlNode2() {
		//Obtain nodes from db
		this.nodeService.getNodesByNames(this.line.terminalNode2).subscribe(
			(data) => {
				this.nodesObjinDBforTermianl2 = data;
				this.nodesInDB = data.map((element) => {
					return element.name;
				});
			},
			(error) => {
				this.nodesInDB = [ 'Error obtaining nodes.' ];
			}
		);
	}

	/**
   * This function runs when the form is submitted.
   * 
   * It runs local validations and resets the form state if the request to db was successfull
   * 
   * @param form 
   */
	onSubmit(form) {
		//Reset feedback messages
		this.successMessage = undefined;
		this.errorMessage = undefined;

		//convert node terminal node names to shortNames
		if (this.nodesInDB) {
			for (let nodeele of this.nodesObjinDBforTermianl1) {
				if (this.line.terminalNode1 == nodeele.name) {
					this.line.terminalNode1 = nodeele.shortName; // client select by name and here i convert it to shortname as i expect it in the deeper layers
				}
			}

			for (let nodeele of this.nodesObjinDBforTermianl2) {
				if (this.line.terminalNode2 == nodeele.name) {
					this.line.terminalNode2 = nodeele.shortName; // client select by name and here i convert it to shortname as i expect it in the deeper layers
				}
			}
		}

		//Translate RGB to a consumable state
		try {
			this.line.RGB = this.formatColor(this.unformattedRGB);

			this.lineService.registerLine(this.line).subscribe(
				(data) => {
					//Send success message to the right screen
					this.successMessage = 'Line was successfully registered.';
					//Reset Form
					form.resetForm();
				},
				(error) => {
					//Send error to the right screen
					this.errorMessage = error.message;
				}
			);
		} catch (err) {
			this.errorMessage = err.message;
		}

		//Reset local object (arrays need to be reset)
		this.line.AllowedDrivers = [];
		this.line.AllowedVehicles = [];
	}

	/**
   * Auxiliary function to format the unformatted RGB into a consumable state
   */
	private formatColor(unformattedRGB: string) {
		try {
			let temp = unformattedRGB.split(',');
			let redStr = +temp[0].substring(4);
			let greenStr = +temp[1];
			let blueStr = +temp[2].substring(0, temp[2].length - 1);

			return {
				red: redStr,
				green: greenStr,
				blue: blueStr
			};
		} catch (err) {
			throw new Error('The Color format is incorrect.');
		}
	}
}
