import { ILine } from '../interfaces/ILine';
import { IDTO_Line } from '../interfaces/IDTO_Line';
import { LineCode } from '../domain/LineCode';
import { LineRGB } from '../domain/LineRGB';
import { LineName } from '../domain/LineName';
import {Node_ShortName } from '../../Node/domain/Node_ShortName';
import { DriverTypeName } from '../../DriverType/domain/DriverTypeName';
import { VehicleType_Name } from '../../VehicleType/domain/VehicleType_Name';

const joi = require('@hapi/joi');

export class Line implements ILine {

    //Line code
    private _code: LineCode;

    //Line name
    private _name: LineName;

    //Line terminal node 1
    private _terminalNode1: Node_ShortName;

    //Line terminal node 2
    private _terminalNode2: Node_ShortName;

    //Line color
    private _RGB: LineRGB;

    //Allowed Drivers
    private _allowedDrivers: DriverTypeName[];

    //Allowed Vehicles
    private _allowedVehicles: VehicleType_Name[];


    /**
     * Constructor of class Line
     * 
     * @param key key
     * @param name name
     * @param terminalNode1 terminal Node 1
     * @param terminalNode2 temrinal Node 2
     * @param allowedDrivers allowed drivers list
     * @param allowedVehicles allowed vehicles list
     * @param RGB line color
     */
    private constructor(key: string, name: string, terminalNode1: string, terminalNode2: string, allowedDrivers: string[], allowedVehicles : string[],RGB?: any) {
        //Value initializations
        this._code = LineCode.create(key);
        this._name = LineName.create(name);
        this._terminalNode1 = Node_ShortName.create(terminalNode1);
        this._terminalNode2 =  Node_ShortName.create(terminalNode2);
        this._allowedDrivers = allowedDrivers.map(DriverTypeName.create);
        this._allowedVehicles = allowedVehicles.map(VehicleType_Name.create);;

        //Check if rgb was introduced as a parameter
        if(RGB == undefined){
            //Default value initialization
            this._RGB = LineRGB.create(0,0,0);
        }else{
            this._RGB = LineRGB.create(RGB.red,RGB.green,RGB.blue);
        }
    }

    /**
     * Obtains the line code
     */
    public get code() {
        return this._code;
	}

    /**
     * Obtains the line name
     */
	public get name(): LineName {
		return this._name;
    }
    
    /**
     * Obtains the line terminal node 1
     */
    public get terminalNode1(): Node_ShortName {
		return this._terminalNode1;
    }
    
    /**
     * Obtains the line terminal node 2
     */
    public get terminalNode2(): Node_ShortName {
		return this._terminalNode2;
    }
    
    /**
     * Obtains the line color
     */
    public get RGB(): LineRGB {
        return this._RGB;
    }

    /**
     * Obtains the line allowed driver list
     */
    public get allowedDrivers(): DriverTypeName[] {
        return this._allowedDrivers;
    }

    /**
     * Obtains the line allowed vehicle list
     */
    public get allowedVehicles(): VehicleType_Name[] {
        return this._allowedVehicles;
    }

    /**
     * Creates a Line object
     * 
     * @param lineDTO Line DTO 
     */
    static async create(lineDTO: IDTO_Line): Promise<Line> {
        return new Promise((resolve,reject) => {
            try {
                const line = new Line(lineDTO.key, lineDTO.name, lineDTO.terminalNode1, lineDTO.terminalNode2,lineDTO.AllowedDrivers,lineDTO.AllowedVehicles,lineDTO.RGB);
                resolve(line);     
            } catch (err) {
                reject(err);
            }
        });
        
    }
}