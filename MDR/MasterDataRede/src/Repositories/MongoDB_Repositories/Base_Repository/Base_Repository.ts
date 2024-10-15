
import { BaseRepositoryInterface } from './IBase_Repository';
//const  {BaseRepository} = require('../Base_Repository/baseRepository')

module.exports=  class Base_Repository implements BaseRepositoryInterface {
    
   private model;

    constructor(model) {
       this.model  = model;
       
      }


    /**
     * Creates a new entity of item type in the database if it does not yet exist
     * @param item 
     */
    async create(item): Promise<any> {
        return this.model.create(item);
    }

    async findByIdentity(identityField:string, key:string): Promise<any> {
        return this.model.findOne({[identityField]:key});
    }

    async findListObjects(searchTarget : string,array : any[]) : Promise<any>{
        return this.model.find({[searchTarget]:{ $in: array}});
    }

    /**
     * Finds if an item corresponding to the query exists in the database
     * 
     * Always returns the promise, any errors will be inside it
     * 
     * @param query 
     */
	async exists(query: any) {
		return this.model.exists(query);
	}
   
}