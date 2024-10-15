import { DriverInterface } from './DriverInterface';

export class Driver {
	mechanographicNumber: string;
    name: string;
    birthDate: string;
    citizenCardNumber: string;
    entryDate: string;
    departureDate?:string;
    fiscalNumber: string;
    type:string;
    license:string;
    licenseDate:string;


	private constructor(mechanographicNumber: string,name: string,birthDate: string,citizenCardNumber: string,entryDate: string,fiscalNumber: string,type:string,license:string,licenseDate:string,departureDate?:string){
        
        
        this.mechanographicNumber=mechanographicNumber;
        this.name=name;
        this.birthDate=birthDate;
        this.citizenCardNumber=citizenCardNumber;
        this.entryDate=entryDate;
        this.fiscalNumber=fiscalNumber;
        this.type=type;
        this.departureDate=departureDate;
        this.license=license;
        this.licenseDate=licenseDate;

		
		
	}

	public static create(object){
        this.validate(object);
        if(object.departureDate){
            return new Driver(object.mechanographicNumber,object.name,object.birthDate,object.citizenCardNumber,object.entryDate,object.fiscalNumber,object.type,object.license,object.licenseDate,object.departureDate);

        }
		return new Driver(object.mechanographicNumber,object.name,object.birthDate,object.citizenCardNumber,object.entryDate,object.fiscalNumber,object.type,object.license,object.licenseDate);

	}

	private static validate(object: DriverInterface) {
		
		//name validation
		if (!object.name) {
			throw new Error('Name is required');
		}

		//mechaNumber validation
		if (object.mechanographicNumber) {
            let re= new RegExp("^([a-zA-Z0-9]{9})$");
			if (!re.test(object.mechanographicNumber) ) {
				throw new Error('Mechanographic Number must be 9 characters long and alphanumeric');
			}
		} else {
			throw new Error('Mechanographic Number is required');
		}

		//citizen card number validation
		if (object.citizenCardNumber) {
            let re = new RegExp("^([0-9]{8})$");
            if (!re.test(object.citizenCardNumber)) {
                throw new Error('Citizen Card Number is in invalid format');
            }
		} else {
			throw new Error('Citizen Card Number is required');
        }

        if (object.fiscalNumber) {
            let re = new RegExp("^([0-9]{9})$");
            if (!re.test(object.fiscalNumber)) {
                throw new Error('Fiscal Number is in invalid format');
            }
		} else {
			throw new Error('Fiscal Number is required');
        }
        
        if(!object.type){

            throw new Error('Type is required');
        }

        if(!object.birthDate){

            throw new Error('Birth Date is required');
        }
        if(!object.entryDate){

            throw new Error('Entry date is required');
        }

        if(!object.license){

            throw new Error('License is required');
        }
        if(!object.licenseDate){

            throw new Error('License date is required');
        }
        
        



	}


}