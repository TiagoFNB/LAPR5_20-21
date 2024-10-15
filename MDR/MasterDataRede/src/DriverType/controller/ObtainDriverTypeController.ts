import { Inject } from 'typedi';
import { Request, Response} from 'express';

import { ObtainDriverTypeServiceInterface } from '../services/IObtainDriverTypeService';

export default class ObtainDriverTypeController {

    constructor(@Inject('DriverType.ObtainDriverTypeService') private ObtainDriverTypeServiceInstance: ObtainDriverTypeServiceInterface) {}

    public async obtainDriverType(req: Request, res: Response):Promise<any> {
       
        await this.ObtainDriverTypeServiceInstance.obtainDriverType(req.params.name)
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