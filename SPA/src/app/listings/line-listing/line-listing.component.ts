import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LineActionsService } from 'src/app/core/services/line-actions/line-actions.service';
import { LineMapperService } from 'src/app/core/services/line-actions/mappers/line-mapper.service';
import { LineViewDTO } from 'src/app/shared/dtos/Line/LineViewDTO';
import { Line } from 'src/app/shared/models/Line/Line';

@Component({
  selector: 'app-line-listing',
  templateUrl: './line-listing.component.html',
  styleUrls: ['./line-listing.component.css']
})
export class LineListingComponent implements OnInit {

  //Table Sorter
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  //Columns definition for the table
  public Columns: string[] = [ 'code', 'name', 'node1','node2', 'allowedDrivers','allowedVehicles','color'];

  //Date source for the table
  public dataSource;

  //Input for parameter search in the listing
  public inputModel :
  {
    code : string,
    name : string,
    node: string
  }

  //Error Message, leave it undefined for the view to not show anything
  public errorMessage : string;

  constructor(private lineService : LineActionsService, private lineMapper : LineMapperService) { }
  

  ngOnInit(): void {
    this.inputModel = {code : '', name : '', node: ''};

    this.startUpDataSource();  
  }

  //Initializes the data source for the table
  private startUpDataSource() : void{
    let dbList : Line[];
    let mappedList : LineViewDTO[];
    try{
      this.lineService.getListLines().subscribe(
        (data) => {
          dbList = data;         
          try{
            mappedList = this.lineMapper.FromMDVListToViewList(dbList);
            this.dataSource = new MatTableDataSource(mappedList);
            
            //Define dataSource properties  
            this.dataSource.sort = this.sort;
            this.dataSource.filterPredicate = this.getFilterPredicate();
          }catch(err){
            this.handleErrors(err);
          }
                   
        },
        (error) => { this.handleErrors(error);});   
    }
    catch(error){
      this.handleErrors(error);
    }
    
    //If dataSource wasn't initialized
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
    return (row : LineViewDTO) =>{
      //Define the return array
      const matchFilter = [];

      // Fetch data from row
      const columnCode = row.code;
      const columnName = row.name;

      const columnNode1 = row.node1;
      const columnNode2 = row.node2;

      // verify fetching data by our searching values
      const customFilterCode = columnCode.toLowerCase().includes(this.inputModel.code);
      const customFilterName = columnName.toLowerCase().includes(this.inputModel.name);
      const customFilterNode = columnNode1.toLowerCase().includes(this.inputModel.node) || columnNode2.toLowerCase().includes(this.inputModel.node);

       // push boolean values into array
       matchFilter.push(customFilterCode);
       matchFilter.push(customFilterName);
       matchFilter.push(customFilterNode);
 
       // return true if all values in array is true
       // else return false
       return matchFilter.every(Boolean);
    };
  }

  //Translate the user input filters for the custom filter
  public applyFilter() : void{
    //Validate and convert everything into lower case for the filter
    if(!this.inputModel.code){
      this.inputModel.code = '';
    }
    else{
      this.inputModel.code = this.inputModel.code.trim().toLowerCase();
    }
    if(!this.inputModel.name){
      this.inputModel.name = '';
    }
    else{
      this.inputModel.name = this.inputModel.name.trim().toLowerCase();
    }
    if(!this.inputModel.node){
      this.inputModel.node = '';
    }
    else{
      this.inputModel.node = this.inputModel.node.trim().toLowerCase();
    }  
    
    this.dataSource.filter=' '; //Needs to have at least 1 char inside the string to activate
  }

}
