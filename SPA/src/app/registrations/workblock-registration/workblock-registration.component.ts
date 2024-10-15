import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { LineActionsService } from 'src/app/core/services/line-actions/line-actions.service';
import { ObtainTripsMapperService } from 'src/app/core/services/trip-actions/mappers/obtainTripsMapper';
import { TripActionsService } from 'src/app/core/services/trip-actions/trip-actions.service';
import { WorkblockActionsService } from 'src/app/core/services/workblock-actions/workblock-actions.service';
import { WorkBlockGeneratorViewDto } from 'src/app/shared/dtos/WorkBlock/WorkBlockGeneratorViewDto';
import { Line } from 'src/app/shared/models/Line/Line';

@Component({
  selector: 'app-workblock-registration',
  templateUrl: './workblock-registration.component.html',
  styleUrls: ['./workblock-registration.component.css']
})
export class WorkblockRegistrationComponent implements OnInit {
  //Auxiliary variables
  public loadingSubmit : boolean;
  public loadingSearch : boolean;
  public successMessage : string;
  public errorMessage : string;
  public minDate: Date;

  //Connecton to html tables
  @ViewChild(MatTable) table: MatTable<any>;

  //Defines the collumns present in the trips table
  TripsColumns: string[] = [ 'Path', 'Departure','Select'];

  //Holds the trips of the currently selected line
  public obtainedTrips: any[];

  //Holds the currently obtained line name
  public lineList : Line[];

  constructor(private workblockService : WorkblockActionsService,private tripService: TripActionsService,private lineService : LineActionsService, private tripMapper : ObtainTripsMapperService) { 
    const currentDate = new Date();
    this.minDate=currentDate;
  }

  //Current Line input by user
  public currentLine: string;

  public workblock : WorkBlockGeneratorViewDto = 
  {
    vehicleServiceId : undefined,
    time : undefined,
    amountBlocks : undefined,
    durationBlocks : undefined,
    selectedTrips : []
  }

  ngOnInit(): void {
    this.currentLine = undefined;
    this.obtainedTrips = [];
    this.loadingSearch = false;
    this.loadingSubmit = false;
  }

  //Obtain all the trips belonging to this line
  obtainTrips() : void{
    this.loadingSearch = true;

    this.errorMessage=undefined;
    this.successMessage=undefined;

    this.obtainedTrips=[];

    if(this.currentLine){

      try{
        this.tripService.obtainTripsOfLine(this.currentLine).subscribe(
          (data) => {
            this.obtainedTrips =this.tripMapper.mapFromMDVToView(data);
             this.loadingSearch = false;
          },
          (error) => {
            //Send error to the right screen
            this.errorMessage = error.error;
             this.loadingSearch = false;
          }
        );
      }catch(error){
        this.errorMessage=error.message;
         this.loadingSearch = false;
      }

    }
    else{
      this.errorMessage="No Line received as input. Please input line to search it's trips."
      this.loadingSearch = false;
    }
    this.refreshTables();
  }

  //Adds an element from the list of trips to selected trips (if it isn't there already)
  onAdd(trip: any) : void{
    if(this.workblock.selectedTrips.filter(x => x.Id === trip.Id).length==0){
      this.workblock.selectedTrips.push(trip);
    }
    this.refreshTables();
  }
  
  //Removes an element from the list of trips in selected trips
  onRemove(trip) : void{
    const index = this.workblock.selectedTrips.indexOf(trip);
    if(index > -1){
      this.workblock.selectedTrips.splice(index,1);
    } 
    this.refreshTables();
  }

  //Refreshes the mat tables contents
  refreshTables() : void{
    this.table.renderRows();
  }
  
  //Occurs when the submit button is clicked
  onSubmit(form) {
    this.loadingSubmit=true;
		//Reset feedback messages
		this.successMessage = undefined;
		this.errorMessage = undefined;

		//convertDriverNameToCode();

		try {
			this.workblockService.registerWorkBlocksOfVehicleService(this.workblock).subscribe(
				(data) => {
					//Send success message to the right screen
					this.successMessage = this.handleSuccess(data);
          //Reset Form
          form.resetForm();
          this.loadingSubmit = false;
				},
				(error) => {
					//Send error to the right screen
          this.errorMessage = this.handleErrors(error);
          this.loadingSubmit = false;
				}
			);
		} catch (err) {
      this.errorMessage = err.message;
      this.loadingSubmit = false;
    }
    
  }

  handleErrors(error) : string {
    if(error.message.includes(" Unknown Error")){
      return error.message;
    }
    else{
      return error.error;
    }
  }

  handleSuccess(data) : string{
    let result : string;

    if(data.wks){

      result = "Created " + data.wks.length + " workblocks successfully.";

    }else{
      throw new Error("Unknown error ocurred.");
    }

    return result;
  }

  presentLineNames(){
    if(this.currentLine){
      try{
        this.lineService.getListLinesByName(this.currentLine).subscribe(
          (data) => {
            this.lineList = data;
          },
          (error) => {
            this.errorMessage=this.handleErrors(error);
          });
      }catch(error){
        this.errorMessage = error.message;
      }
    }
  }

}
