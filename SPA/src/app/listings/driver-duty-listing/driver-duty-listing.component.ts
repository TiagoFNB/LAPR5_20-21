import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DriverDutyActionsService } from 'src/app/core/services/driverDuty-actions/driver-duty-actions.service';
import { DriverDutyMapperService } from 'src/app/core/services/driverDuty-actions/mappers/driver-duty-mapper.service';
import { WorkblockActionsService } from 'src/app/core/services/workblock-actions/workblock-actions.service';
import { DriverDutyListingDTO } from 'src/app/shared/dtos/DriverDuty/DriverDutyListingDTO';

@Component({
  selector: 'app-driver-duty-listing',
  templateUrl: './driver-duty-listing.component.html',
  styleUrls: ['./driver-duty-listing.component.css'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DriverDutyListingComponent implements OnInit,AfterViewInit {

  //Table Sorter
  @ViewChild(MatSort, {static: false}) sort: MatSort;
    
  //Columns definition for the table
  public Columns: string[] = [ 'driverDutyCode', 'driverId', 'date'];
  //public columnsToDisplay: string[] = ['node1'];
  //Date source for the table
  public dataSource;

  //Available types of path to filter
  public types: string[];
  public dbList1 : DriverDutyListingDTO[]=[];
  //Input for parameter search in the listing
  public inputModel :
  {
    driverDutyCode : string,
    driverId : string,
    date: string
  }

  //Error Message, leave it undefined for the view to not show anything
  public errorMessage : string;

  isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');
  expandedElement: any;

  constructor(private driverDutyService : DriverDutyActionsService, private wbService : WorkblockActionsService, private mapper: DriverDutyMapperService) { }

  async ngAfterViewInit() {
   
  }

   async ngOnInit() {
    
    this.inputModel = {driverDutyCode: '', driverId : '', date: ''};
    await this.startUpDataSource().then((obj :any)=>{

        this.dataSource = new MatTableDataSource(this.dbList1);
  
        //Define dataSource properties  
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = this.getFilterPredicate();
      });

        if(!this.dataSource){
          this.dataSource = new MatTableDataSource([]);
        }
     
  }

  //Initializes the data source for the table
  private async startUpDataSource():Promise<void>{
    
    try{
     await this.driverDutyService.getAllDriverDuties().toPromise().then((data)=>
         {
       
          this.dbList1 = this.mapper.FromMDVListToViewList(data);
       
      }).catch((err) => {
        this.handleErrors(err);
      }); 

        for(let driverDuty of this.dbList1){
          await this.wbService.obtainWorkBlocksOfDriverDuty(driverDuty.driverDutyCode).toPromise().then(
            (data) => {
              this.mapper.MapWorkblocksOfDriverDutyListing(driverDuty,data);
                     
            }).catch((err) => {
              this.handleErrors(err);
            }); 
        }  

    }
    catch(error){
      this.handleErrors(error);
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
    return (row : DriverDutyListingDTO) =>{
      //Define the return array

      const matchFilter = [];

      // Fetch data from row
      const columnCode = row.driverDutyCode;
      const columnDate = row.date;
      const columnDriver = row.driverId;
    
      // verify fetching data by our searching values
      const customFilterCode = columnCode.toLowerCase().includes(this.inputModel.driverDutyCode.toLowerCase());
      const customFilterDriver = columnDriver.toLowerCase().includes(this.inputModel.driverId.toLowerCase());
      //const customFilterType = columnType.includes(this.inputModel.type);
      const customFilterDate = columnDate.toLowerCase().includes(this.inputModel.date.toLowerCase());


       // push boolean values into array
       matchFilter.push(customFilterCode);
       matchFilter.push(customFilterDriver);
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
    if(!this.inputModel.driverDutyCode){
      this.inputModel.driverDutyCode = '';
    }
    else{
      this.inputModel.driverDutyCode= this.inputModel.driverDutyCode.trim();
    }
    if(!this.inputModel.driverId){
      this.inputModel.driverId = '';
    }
    else{
      this.inputModel.driverId = this.inputModel.driverId.trim();
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
