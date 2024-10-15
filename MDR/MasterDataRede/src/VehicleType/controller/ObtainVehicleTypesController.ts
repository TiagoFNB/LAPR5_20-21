import { Inject } from 'typedi';
import { Request, Response} from 'express';
import { ObtainVehicleTypesServiceInterface } from '../services/IObtainVehicleTypesService';

export default class ObtainVehicleTypesController {

    constructor(@Inject('VehicleType.ObtainVehicleTypesService') private ObtainVehicleTypesServiceInstance: ObtainVehicleTypesServiceInterface) {}

    public async obtainVehicleTypes(req: Request, res: Response):Promise<any> {
       
        await this.ObtainVehicleTypesServiceInstance.obtainVehicleTypes()
            .then((dt)=>{
                return res.status(201).send(dt);
            })
            .catch((err) => {
                return res.status(422).send(err.message);
            });
    }



}
