import { VehicleInterface } from './VehicleInterface';

export class Vehicle {
    license:string;
    vin: string;
    entryDateOfService:string;
	type: string;

	private constructor(license:string,vin: string,entryDateOfService:string,type: string){
		this.license=license;
        this.vin=vin;
        this.entryDateOfService=entryDateOfService;
        this.type=type;
	}

	public static create(object){
		this.validate(object);
		return new Vehicle(object.license,object.vin,object.entryDateOfService,object.type);

	}

	private static validate(object: VehicleInterface) {
		
		//vin validation
		if (object.vin) {
            let re= new RegExp("^([a-zA-Z0-9]{17})$");
			if (!re.test(object.vin) ) {
				throw new Error('Vin must be 17 characters long and alphanumeric');
			}
		} else {
			throw new Error('Vin is required');
		}

		//license validation
		if (object.license) {
            let re = new RegExp("^([0-9]{2}-[0-9]{2}-[A-Z]{2})$|^([0-9]{2}-[A-Z]{2}-[0-9]{2})$|^([A-Z]{2}-[0-9]{2}-[0-9]{2})$|^([A-Z]{2}-[0-9]{2}-[A-Z]{2})$");
            if (!re.test(object.license)) {
                throw new Error('License is in invalid format');
            }
		} else {
			throw new Error('License is required');
        }
        
        if(!object.type){

            throw new Error('Type is required');
        }

        if(!object.entryDateOfService){
			

            throw new Error('Entry date of service is required');
        }else{
			try {
				Date.parse(object.entryDateOfService);
			} catch (err) {
				throw new Error('Entry date of service is in invalid format!');
			}
		}


	}


}
