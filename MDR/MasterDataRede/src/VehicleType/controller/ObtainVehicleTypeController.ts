import { Inject } from 'typedi';
import { Request, Response} from 'express';
import { ObtainVehicleTypesServiceInterface } from '../services/IObtainVehicleTypesService';
import { ObtainVehicleTypeServiceInterface } from '../services/IObtainVehicleTypeService';

export default class ObtainVehicleTypeController {

    constructor(@Inject('VehicleType.ObtainVehicleTypeService') private ObtainVehicleTypeServiceInstance: ObtainVehicleTypeServiceInterface) {}

    public async obtainVehicleType(req: Request, res: Response):Promise<any> {
       
        await this.ObtainVehicleTypeServiceInstance.obtainVehicleType(req.params.name)
            .then((dt)=>{
               
                if(dt==undefined){
                    return res.status(404).send(dt);
                }
                
                return res.status(200).send(dt);
            })
            .catch((err) => {
                
                return res.status(400).send(err.message);
            });
    }



}