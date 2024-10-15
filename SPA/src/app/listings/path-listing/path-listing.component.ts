import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PathMapperService } from 'src/app/core/services/path-actions/mappers/path-mapper.service';
import { PathActionsService } from 'src/app/core/services/path-actions/path-actions.service';
import { PathViewDTO } from 'src/app/shared/dtos/Path/PathViewDTO';
import { Path } from 'src/app/shared/models/path/Path';

@Component({
  selector: 'app-path-listing',
  templateUrl: './path-listing.component.html',
  styleUrls: ['./path-listing.component.css'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PathListingComponent implements OnInit {
  //Table Sorter
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  
  //Columns definition for the table
  public Columns: string[] = [ 'key', 'line', 'type'];
  public columnsToDisplay: string[] = ['node1'];
  //Date source for the table
  public dataSource;

  //Available types of path to filter
  public types: string[];

  //Input for parameter search in the listing
  public inputModel :
  {
    key : string,
    line : string,
    type: string
  }

  //Error Message, leave it undefined for the view to not show anything
  public errorMessage : string;

  isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');
  expandedElement: any;

  constructor(private pathService : PathActionsService, private pathMapper : PathMapperService) { }

  ngOnInit(): void {
    this.types = ['', 'Go', 'Return', 'Reinforcement' ];
    this.inputModel = {key : '', line : '', type: ''};

    this.startUpDataSource();  
  }

  //Initializes the data source for the table
  private startUpDataSource() : void{
    let dbList : Path[];
    let mappedList : PathViewDTO[];
    try{
      this.pathService.getAllPaths().subscribe(
        (data) => {
          try{
          dbList = data;
          mappedList = this.pathMapper.FromMDVListToViewList(dbList);
          this.dataSource = new MatTableDataSource(mappedList);

          //Define dataSource properties  
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = this.getFilterPredicate();
        } catch(err){
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
    return (row : PathViewDTO) =>{
      //Define the return array
      const matchFilter = [];

      // Fetch data from row
      const columnKey = row.key;
      const columnLine = row.line;
      const columnType = row.type;

      // verify fetching data by our searching values
      const customFilterKey = columnKey.toLowerCase().includes(this.inputModel.key.toLowerCase());
      const customFilterLine = columnLine.toLowerCase().includes(this.inputModel.line.toLowerCase());
      const customFilterType = columnType.includes(this.inputModel.type);

       // push boolean values into array
       matchFilter.push(customFilterKey);
       matchFilter.push(customFilterLine);
       matchFilter.push(customFilterType);
 
       // return true if all values in array is true
       // else return false
       return matchFilter.every(Boolean);
    };
  }

  //Translate the user input filters for the custom filter
  public applyFilter() : void{
    //Validate and convert everything into lower case for the filter
    if(!this.inputModel.key){
      this.inputModel.key = '';
    }
    else{
      this.inputModel.key = this.inputModel.key.trim();
    }
    if(!this.inputModel.line){
      this.inputModel.line = '';
    }
    else{
      this.inputModel.line = this.inputModel.line.trim();
    }
    if(!this.inputModel.type || !(this.inputModel.type == 'Go' || this.inputModel.type == 'Return' || this.inputModel.type == 'Reinforcement')){
      this.inputModel.type = '';
    }
    else{
      this.inputModel.type = this.inputModel.type.trim();
    }  
    
    this.dataSource.filter=' '; //Needs to have at least 1 char inside the string to activate
  }

}
