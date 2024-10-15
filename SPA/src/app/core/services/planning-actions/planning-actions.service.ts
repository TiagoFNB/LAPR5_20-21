import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AffectDriverDutiesDtoFromPlanning } from 'src/app/shared/models/Planning/AffectDriverDuties/AffectDriverDutiesDtoFromPlanning';
import { environment } from '../../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class PlanningActionsService {
	PlanningURL = environment.PlanningURL;
	constructor(private http: HttpClient) {}

	sendAffectDriversGeneticAlgorithmRequest(date: string) {
		console.log('entrou! service data = !!');
		let darray = date.split('/');

		let day1: any = darray[0];
		day1 = parseInt(day1);
		let month1: any = darray[1];
		month1 = parseInt(month1);
		let year1: any = darray[2];
		year1 = parseInt(year1);
		console.log(day1 + '/' + month1 + '/' + year1);

		let url = this.PlanningURL + '/plannings/AffectDrivers';
		//let url = 'http://localhost:5000/plannings/AffectDrivers';
		//If we are in production mode, send code 1 to planning (which signifies production mode), otherwise send 0 to signify development mode
		let deploy;
		if (url.includes('uvm039.dei.isep.ipp.pt')) {
			deploy = 1;
		} else {
			deploy = 0;
		}
		const body = JSON.stringify({ deploy: deploy, day: day1, month: month1, year: year1 });
		console.log('body');
		console.log(body);
		const headers = { 'content-type': 'application/json' };

		return this.http.post<any>(url, body, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
	}

	persisteGaResult(result) {
		let mdvurl = environment.MDVURL;
		let url = mdvurl + '/mdvapi/PlannedDriverDuty';

		const headers = { 'content-type': 'application/json' };
		const body = JSON.stringify(result);
		return this.http.post<any>(url, body, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
	}

	sendGeneticAlgorithmRequest(vehicleDutyId: string, maxDuration: number) {
		let duration = Math.floor(maxDuration);

		this.ValidateGeneticArgs(vehicleDutyId, duration);

		let url = this.PlanningURL + '/plannings/Genetic';

		//If we are in production mode, send code 1 to planning (which signifies production mode), otherwise send 0 to signify development mode
		let deploy;
		if (url.includes('uvm039.dei.isep.ipp.pt')) {
			deploy = 1;
		} else {
			deploy = 0;
		}

		const headers = { 'content-type': 'application/json' };
		const body = JSON.stringify({ deploy: deploy, duration: duration, veicDutyId: vehicleDutyId });
		return this.http.post<any>(url, body, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
	}

	ValidateGeneticArgs(vehicleDutyId: string, maxDuration: number) {
		if (maxDuration <= 0) {
			throw new Error('Error: Duration must be higher than 0.');
		}
	}

	convertToUiResponseToGenetic(planningResults: any, workblockList: any): any {
		let length = planningResults.drivers.length;
		if (length == 0 || length != workblockList.length) {
			throw new Error('No valid results obtained.');
		}

		let results: { driver: string; workblock: string }[] = [ length ];

		let i = 0;
		for (; i < length; i++) {
			var workBlockElem = workblockList.filter((obj) => {
				return obj.code == planningResults.workblocks[i];
			});

			let timeString;
			let startTime = workBlockElem[0].startTime;
			let endTime = workBlockElem[0].endTime;

			timeString = this.convertSecToTime(startTime) + '-->' + this.convertSecToTime(endTime);

			results[i] = { driver: planningResults.drivers[i], workblock: timeString };
		}

		return results;
	}

	convertToUiResponseToAffectAllDriversGenetic(planningResults: AffectDriverDutiesDtoFromPlanning): any {
		let length = planningResults.lista.length;
		if (length == 1) {
			throw new Error('No valid results obtained.');
		}

		let results: { driver: string; workblock: string }[] = [ length ];

		for (let i = 0; i < length; i++) {
			let durationString = '';
			for (let u = 0; u < planningResults.lista[i].workBlockDurationList.length; u++) {
				if (planningResults.lista[i].workBlockDurationList[u] != undefined) {
					let Ti = planningResults.lista[i].workBlockDurationList[u].Ti;
					let Tf = planningResults.lista[i].workBlockDurationList[u].Tf;
					if (durationString == '') {
						durationString = Ti + '-->' + Tf;
					} else {
						durationString = durationString + ' . ' + Ti + '-->' + Tf;
					}
				}
			}

			results[i] = { driver: planningResults.lista[i].driverMecNumber, workblock: durationString };
		}
		console.log('DISPLAYED RESULT');
		console.log(results);

		return results;
	}

	private convertSecToTime(seconds: number) {
		var h = Math.floor(seconds / 3600);
		var m = Math.floor((seconds % 3600) / 60);

		return ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) + 'h';
	}

	/**
   * Sends planning a request to run an algorithm
   * 
   * @param type type of algorithm to run
   * @param start start node
   * @param destination destination node
   * @param hour starting hour
   * @param minute starting minute
   */
	sendAlgorithmRequest(type: String, start: string, destination: string, hour: number, minute: number) {
		//Turn the starting time into seconds
		let startTime;
		try {
			startTime = this.turnIntoSeconds(hour, minute);
		} catch (err) {
			return throwError(err);
		}

		let url = this.PlanningURL + '/plannings/' + type;
		//If we are in production mode, send code 1 to planning (which signifies production mode), otherwise send 0 to signify development mode
		let deploy;
		if (url.includes('uvm039.dei.isep.ipp.pt')) {
			deploy = 1;
		} else {
			deploy = 0;
		}

		const headers = { 'content-type': 'application/json' };
		const body = JSON.stringify({ startTime: startTime, startNode: start, destNode: destination, deploy: deploy });
		return this.http.post<any>(url, body, { headers: headers }).pipe(
			catchError((err) => {
				throw err;
			})
		);
	}

	convertToUiResponseToGeneratorOfAllSolutionsAlgoritm(object) {
		if (object.caminho == []) {
			throw new Error("There's no path available to that period of time");
		}
		let temp: string = '';
		let tempPath: string = '';

		let index = 0;
		for (let path of object.caminho) {
			if (index == 0) {
				temp = temp.concat(path.no1);
				temp = temp.concat(', ');
			}
			index++;
			temp = temp.concat(path.no2);
			tempPath = tempPath.concat(path.path);
			if (index != object.caminho.length) {
				temp = temp.concat(', ');
				tempPath = tempPath.concat('-');
			}
		}

		const objectready = {
			nodes: temp,
			path: tempPath,
			time: object.tempo
		};
		let arrayObjectsReady: any[] = [];
		arrayObjectsReady.push(objectready);
		return arrayObjectsReady;
	}

	/**
	 * Convert object received from planning into a table ready object
	 * 
	 * @param object 
	 */
	convertToUiResponseForAStartAndBestFirst(object) {
		let res;

		if (!object.lista) {
			res = {
				lista: [ object ]
			};
		} else {
			res = object;
		}

		return res.lista.map((element) => {
			let transformed: {
				nodes?: string;
				paths?: string;
				time?: string;
			};
			transformed = {};

			//Obtains the formatted nodes
			let temp: string = '';

			for (let node of element.caminho) {
				temp = temp.concat('-' + node);
			}

			transformed.nodes = temp.substring(1, temp.length);

			//Obtains the formatted paths
			temp = '';

			for (let path of element.percursos) {
				temp = temp.concat('-' + path);
			}

			transformed.paths = temp.substring(1, temp.length);
			//Obtains the formatted lines
			transformed.time = new Date(element.tempo * 1000).toISOString().substr(11, 8);

			return transformed;
		});
	}

	/**
   * Converts the hours and minutes of an instant into it's equivalent number of seconds
   * 
   * @param hour hour
   * @param minute minute
   */
	turnIntoSeconds(hour: number, minute: number): number {
		if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
			return hour * 3600 + minute * 60;
		} else {
			throw new Error('Inserted time is invalid.');
		}
	}
}
