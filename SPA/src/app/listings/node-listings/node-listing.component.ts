import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LineActionsService } from 'src/app/core/services/line-actions/line-actions.service';
import { LineMapperService } from 'src/app/core/services/line-actions/mappers/line-mapper.service';
import { NodeServiceService } from 'src/app/core/services/node-service.service';
import { LineViewDTO } from 'src/app/shared/dtos/Line/LineViewDTO';
import { Node } from 'src/app/shared/models/Node/node';

@Component({
	selector: 'app-node-listing',
	templateUrl: './node-listing.component.html',
	styleUrls: [ './node-listing.component.css' ]
})
export class NodeListingComponent implements OnInit {
	//Table Sorter
	@ViewChild(MatSort, { static: false })
	sort: MatSort;

	// nodes array that i will get from MDR
	public dbList: Node[] = [];

	//Columns definition for the table
	public Columns: string[] = [
		'Name',
		'ShortName',
		'Latitude',
		'Longitude',
		'Depot',
		'ReliefPoint' //,
		//'Crew travel time duration',
		//	'Crew Travel Time Reference Node'
	];

	//Date source for the table
	public dataSource;

	//Input for parameter search in the listing
	public inputModel: {
		name: string;
		shortName: string;
		latitude: number;
		longitude: number;
	};

	//Error Message, leave it undefined for the view to not show anything
	public errorMessage: string;

	constructor(private nodeService: NodeServiceService) {}

	ngOnInit(): void {
		this.inputModel = { name: '', shortName: '', latitude: null, longitude: null };

		this.startUpDataSource();
	}

	//Initializes the data source for the table
	private startUpDataSource(): void {
		let mappedList: LineViewDTO[];
		try {
			this.nodeService.getAllNodes().subscribe(
				(data) => {
					this.dbList = data;
					try {
						//	mappedList = this.lineMapper.FromMDVListToViewList(dbList);
						this.dataSource = new MatTableDataSource(this.dbList);
						console.log('list!!!');
						console.log(this.dbList);
						//Define dataSource properties
						this.dataSource.sort = this.sort;
						this.dataSource.filterPredicate = this.getFilterPredicate();
					} catch (err) {
						this.handleErrors(err);
					}
				},
				(error) => {
					this.handleErrors(error);
				}
			);
		} catch (error) {
			this.handleErrors(error);
		}

		//If dataSource wasn't initialized
		if (!this.dataSource) {
			this.dataSource = new MatTableDataSource([]);
		}
	}

	//Converts received error into client side error notification message
	private handleErrors(error: Error): void {
		if (error.message.includes('Http failure response for')) {
			this.errorMessage = 'Unable to reach server.';
		} else {
			this.errorMessage = error.message;
		}
	}

	//Obtains the definition of how the table's filter should work
	// Inspired by https://sevriukovmk.medium.com/angular-mat-table-filter-2ead680c57bb
	private getFilterPredicate() {
		return (row: Node) => {
			//Define the return array
			const matchFilter = [];

			// Fetch data from row
			const columnShortName = row.shortName;
			const columnName = row.name;
			const columnLat = row.latitude;
			const columnLong = row.longitude;

			// verify fetching data by our searching values
			const customFilterShortName = columnShortName.toLowerCase().startsWith(this.inputModel.shortName);
			const customFilterName = columnName.toLowerCase().startsWith(this.inputModel.name);

			if (this.inputModel.latitude != null) {
				const columnFilterLat = columnLat.toString().startsWith(this.inputModel.latitude.toString());
				matchFilter.push(columnFilterLat);
			}

			if (this.inputModel.longitude != null) {
				const columnFilterLong = columnLong.toString().startsWith(this.inputModel.longitude.toString());
				matchFilter.push(columnFilterLong);
			}

			//	const columnFilterLong = columnLong == this.inputModel.longitude;

			// push boolean values into array
			matchFilter.push(customFilterName);
			matchFilter.push(customFilterShortName);

			//matchFilter.push(columnFilterLong);

			// return true if all values in array is true
			// else return false
			return matchFilter.every(Boolean);
		};
	}

	//Translate the user input filters for the custom filter
	public applyFilter(): void {
		//Validate and convert everything into lower case for the filter
		if (!this.inputModel.shortName) {
			this.inputModel.shortName = '';
		} else {
			this.inputModel.shortName = this.inputModel.shortName.trim().toLowerCase();
		}
		if (!this.inputModel.name) {
			this.inputModel.name = '';
		} else {
			this.inputModel.name = this.inputModel.name.trim().toLowerCase();
		}

		this.dataSource.filter = ' '; //Needs to have at least 1 char inside the string to activate
	}
}
