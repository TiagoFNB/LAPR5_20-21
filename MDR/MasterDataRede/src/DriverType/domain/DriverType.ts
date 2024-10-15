
const { validateDriverType } = require('../services/drivertype_validation');
import { DriverTypeInterface } from './IDriverType';
import { IDriverTypeDTO } from '../interfaces/IDriverTypeDTO';
import Model = require('mongoose');
import { DriverTypeName } from './DriverTypeName';

export class DriverType implements DriverTypeInterface{
  
    private _key?: string;
 
    private _name: DriverTypeName;
 

     private _description: string;
    
 
 
   
     private constructor(name: string, description: string, key?: string) {
 
     const validationResult =  this.validation(key, description);
      if(validationResult.error)
      throw new Error(validationResult.error);
   
       
      if (key) this._key = key;
       this._name = DriverTypeName.create(name);
       this._description = description;

 
     }


    static obtainIdField(): string {
      return 'name';
    }

  
    
   static async create(driverTypeDTO: any) : Promise<any> {

    return new Promise(function(resolve, reject) {

        try{
            const dt = new DriverType(driverTypeDTO.name,driverTypeDTO.description,driverTypeDTO.key);
            resolve(dt);
        }catch(e){
            reject(e);
        }
      });
}



 
     private validation(key: string, description: string){
       return validateDriverType({key, description});
     }
 
     
 
     public get key(){
       return this._key;
     }
 
     public get name():DriverTypeName{
       return this._name;
     }

     public get description(){
       return this._description;
     }

    
   }