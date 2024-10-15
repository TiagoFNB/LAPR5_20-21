import { VehicleDutyMapperService } from './../../core/services/vehicleDuty-actions/mappers/vehicle-duty-mapper.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VehicleDutyActionsService } from 'src/app/core/services/vehicleDuty-actions/vehicle-duty-actions.service';
import { WorkblockActionsService } from 'src/app/core/services/workblock-actions/workblock-actions.service';
import { VehicleDutyListingDTO } from 'src/app/shared/dtos/VehicleDuty/VehicleDutyListingDTO';


@Component({
  selector: 'app-vehicle-duty-listing',
  templateUrl: './vehicle-duty-listing.component.html',
  styleUrls: ['./vehicle-duty-listing.component.css'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VehicleDutyListingComponent implements OnInit,AfterViewInit {

    //Table Sorter
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    
    //Columns definition for the table
    public Columns: string[] = [ 'vehicleDutyCode', 'vehicleLicense', 'date'];
    //public columnsToDisplay: string[] = ['node1'];
    //Date source for the table
    public dataSource;
  
    //Available types of path to filter
    public types: string[];
    public dbList1 : VehicleDutyListingDTO[]=[];
    //Input for parameter search in the listing
    public inputModel :
    {
      vehicleDutyCode : string,
      vehicleLicense : string,
      date: string
    }
  
    //Error Message, leave it undefined for the view to not show anything
    public errorMessage : string;
  
    isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');
    expandedElement: any;
  
    constructor(private vehicleDutyService : VehicleDutyActionsService, private wbService : WorkblockActionsService, private mapper: VehicleDutyMapperService) { }
  async ngAfterViewInit() {
     
  }
  
     async ngOnInit() {
      
      this.inputModel = {vehicleDutyCode: '', vehicleLicense : '', date: ''};
  await this.startUpDataSource();//.then((data)=>{
    
          //    this.dataSource = new MatTableDataSource(this.dbList1);
    
          // //Define dataSource properties  
          // this.dataSource.sort = this.sort;
          // this.dataSource.filterPredicate = this.getFilterPredicate();});
          // if(!this.dataSource){
          //   this.dataSource = new MatTableDataSource([]);
          //}
       
    }
  
    //Initializes the data source for the table
    private async startUpDataSource():Promise<void>{
        
      try{
       await this.vehicleDutyService.getAllVehicleDuties().toPromise().then((data)=>
           {
         
            this.dbList1 = this.mapper.FromMDVListToViewList(data);
         
        }).catch((err) => {
          this.handleErrors(err);
        }); 

          for(let vehicleDuty of this.dbList1){
            await this.wbService.obtainWorkBlocksOfVehicleDuty(vehicleDuty.vehicleDutyCode).toPromise().then(
              (data) => {
                this.mapper.MapWorkblocksOfVehicleDutyListing(vehicleDuty,data);
                       
              }).catch((err) => {
                this.handleErrors(err);
              }); 
          }
                  
      }
      catch(error){
        this.handleErrors(error);
      }

      this.dataSource = new MatTableDataSource(this.dbList1);
    
      //Define dataSource properties  
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = this.getFilterPredicate();
      if(!this.dataSource){
        this.dataSource = new MatTableDataSource([]);
      }
    
    }
  
    //Converts received error into client side error notification message
    private handleErrors(error : Error) : void{
      if(error.message.includes('Http failure response for')){
        this.errorMessage = "Unable to reach server."
      }
      else{
        this.errorMessage = error.message;
      }
    }
  
    //Obtains the definition of how the table's filter should work
    // Inspired by https://sevriukovmk.medium.com/angular-mat-table-filter-2ead680c57bb
    private getFilterPredicate(){
      return (row : VehicleDutyListingDTO) =>{
        //Define the return array

        const matchFilter = [];
  
        // Fetch data from row
        const columnCode = row.vehicleDutyCode;
        const columnDate = row.date;
        const columnVehicle = row.vehicleLicense;
      
        // verify fetching data by our searching values
        const customFilterCode = columnCode.toLowerCase().includes(this.inputModel.vehicleDutyCode.toLowerCase());
        const customFilterVehicle = columnVehicle.toLowerCase().includes(this.inputModel.vehicleLicense.toLowerCase());
        //const customFilterType = columnType.includes(this.inputModel.type);
        const customFilterDate = columnDate.toLowerCase().includes(this.inputModel.date.toLowerCase());

  
         // push boolean values into array
         matchFilter.push(customFilterCode);
         matchFilter.push(customFilterVehicle);
         matchFilter.push(customFilterDate);
       //  matchFilter.push(customFilterType);
          
         // return true if all values in array is true
         // else return false
         return matchFilter.every(Boolean);
      };
    }
  
    //Translate the user input filters for the custom filter
    public applyFilter() : void{
      //Validate and convert everything into lower case for the filter
      if(!this.inputModel.vehicleDutyCode){
        this.inputModel.vehicleDutyCode = '';
      }
      else{
        this.inputModel.vehicleDutyCode= this.inputModel.vehicleDutyCode.trim();
      }
      if(!this.inputModel.vehicleLicense){
        this.inputModel.vehicleLicense = '';
      }
      else{
        this.inputModel.vehicleLicense = this.inputModel.vehicleLicense.trim();
      }
      if(!this.inputModel.date ){
        this.inputModel.date = '';
      }
      else{
        this.inputModel.date = this.inputModel.date.trim();
      }  
      
      this.dataSource.filter=' '; //Needs to have at least 1 char inside the string to activate
    }

}
