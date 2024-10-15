import { Inject } from 'typedi';
import { Request, Response , nextFunction } from 'express';


import { RegisterDriverTypeServiceInterface } from '../services/IRegisterDriverTypeService';
import { IDriverTypeDTO } from '../interfaces/IDriverTypeDTO';
const express = require('express');
const app = express();
const DriverType = require('../domain/DriverType');



export default class RegisterDriverTypeController {

    constructor(@Inject('DriverType.Registerservice') private registerDriverTypeServiceInstance: RegisterDriverTypeServiceInterface) {
      

    }

    public async registerDriverType(req: Request, res: Response):Promise<any> {
        

        
        

        const dt_data = req.body;
       
        await this.registerDriverTypeServiceInstance.registerDriverType(dt_data as IDriverTypeDTO)
            .then((dt)=>{
                
                return res.status(201).send(dt);

            })
            .catch((err) => {
                if(err.driver){
                    return res.status(422).send(err.message);
                }else{
                    return res.status(400).send(err.message);
                }
            });



    }



}
