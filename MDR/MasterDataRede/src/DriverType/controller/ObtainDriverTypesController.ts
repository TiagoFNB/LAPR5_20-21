import { Inject } from 'typedi';
import { Request, Response} from 'express';

import { ObtainDriverTypesServiceInterface } from '../services/IObtainDriverTypesService';
const express = require('express');
const app = express();
const DriverType = require('../domain/DriverType');



export default class ObtainDriverTypesController {

    constructor(@Inject('DriverType.ObtainDriverTypesService') private ObtainDriverTypesServiceInstance: ObtainDriverTypesServiceInterface) {}

    public async obtainDriverTypes(req: Request, res: Response):Promise<any> {
       
        await this.ObtainDriverTypesServiceInstance.obtainDriverTypes()
            .then((dt)=>{
                return res.status(201).send(dt);
            })
            .catch((err) => {
                return res.status(422).send(err.message);
            });
    }



}
