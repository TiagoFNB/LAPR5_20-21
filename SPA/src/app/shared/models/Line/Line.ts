import { LineInterface } from './ILine';

export class Line implements LineInterface {
	key: string;
	name: string;
	RGB : {
        red:number;
        green:number;
        blue:number;
    }
	terminalNode1: string;
	terminalNode2: string;
	AllowedDrivers: string[];
	AllowedVehicles: string[];

	constructor(code: string,name: string,RGB : any,terminalNode1: string,
		terminalNode2: string,allowedDrivers: string[],allowedVehicles: string[]) {

		this.validate(code,name,RGB,terminalNode1,terminalNode2,allowedDrivers,allowedVehicles);

		this.key = code;
		this.name = name;
		this.RGB={
			red:RGB.red,
			green:RGB.green,
			blue:RGB.blue}
		
		this.terminalNode1=terminalNode1;
		this.terminalNode2=terminalNode2;
		this.AllowedDrivers=allowedDrivers;
		this.AllowedVehicles=allowedVehicles;
	}


	/**
	 * Throws an error with an user-oriented message if the validation fails
	 * 
	 * @param code Line code
	 * @param name Line name
	 * @param RGB Line color
	 * @param terminalNode1 Line terminal Node
	 * @param terminalNode2 Line terminal Node
	 * @param allowedDrivers List of allowed driver types
	 * @param allowedVehicles List of allowed vehicle types
	 */
	private validate(code: string,name: string,RGB : any,terminalNode1: string,
		terminalNode2: string,allowedDrivers: string[],allowedVehicles: string[]){
		
		// If any of the attributes is undefined
		if(!code || !name || !RGB || !terminalNode1 || !terminalNode2 || !allowedDrivers || !allowedVehicles){
			throw new Error('One of the fields was not filled.');
		}
		//RGB values are invalid
		else if(RGB.red<0 || RGB.red>255 || RGB.green<0 || RGB.green>255 || RGB.blue<0 || RGB.blue>255){
			throw new Error('The Color format is incorrect.');
		}

	}

	/**
	 * Creates a Line from a Line Dto
	 * 
	 * @param Iline Line Interface
	 */
	public static create(Iline? : LineInterface) : Line{
		if(Iline){
			return new Line(Iline.key,Iline.name,Iline.RGB,Iline.terminalNode1,Iline.terminalNode2,Iline.AllowedDrivers,Iline.AllowedVehicles);
		}		
	}

}
