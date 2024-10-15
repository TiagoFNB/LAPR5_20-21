  
export interface BaseRepositoryInterface {
    create(item:any): Promise<any>;
    findByIdentity(idField:string,item:string): Promise<any>;
    findListObjects(arrayType : string,array : any[]) : Promise<any>;
    exists(query : any) : Promise<any>;
  }