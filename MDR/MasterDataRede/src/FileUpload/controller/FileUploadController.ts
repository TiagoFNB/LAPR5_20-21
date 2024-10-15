import { Service, Inject } from 'typedi';
const fileUpload = require('express-fileupload');
const fs = require('fs');
const { DOMParser } = require('xmldom');
const xml2js = require('xml2js');
import { IDTO_Node } from '../../Node/DTO/IDTO_Node';
import { RegisterNodeServiceInterface } from '../../Node/services/INodeRegisterService';
import { Router, Request, Response, NextFunction } from 'express';
import { RegisterDriverTypeServiceInterface } from '../../DriverType/services/IRegisterDriverTypeService';
import { FileUploadServiceInterface } from '../services/IFileUploadService';


const convert = require('xml-js');
export default class FileUploadController {

    constructor(
        @Inject('FileUpload.service') private fileUploadServiceInstance: FileUploadServiceInterface) {
        //console.log('NODE CONSTRUCTOR CONTROLLER PRINT');
    }



    public async parseFile(req: any, res: any): Promise<any> {

        try {
            let er;
            if (!req.files) {
                return res.send({
                    status: false,
                    message: 'No file uploaded'
                });
            } else {

                //Use the name of the input field (i.e. "xml") to retrieve the uploaded file      
                let xml = req.files.xml.tempFilePath;
                await this.fileUploadServiceInstance.fileUpload(xml).then((err)=>{
                    
                   return res.status(201).send({
                        status: 201,
                        message: 'File is uploaded',
                        errors: err
                    });


                })
                .catch((err)=>{
                    return res.status(400).send({
                        status: false,
                        message: 'Error parsing file',
                        errors: err
                    });
                })





            }

            //send response
            // res.send({
            //     status: true,
            //     message: 'File is uploaded',
            //     errors: er
            // });

        
        } catch(err) {
            console.log(err);
           return res.status(500).send(err);
    }
}








}