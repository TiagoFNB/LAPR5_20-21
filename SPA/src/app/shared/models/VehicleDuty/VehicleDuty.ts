import { VehicleDutyViewDTO } from '../../dtos/VehicleDuty/VehicleDutyViewDTO';
import { VehicleDutyInterface } from './VehicleDutyInterface';

export class VehicleDuty{
	VehicleDutyCode: string;
	VehicleLicense: string;

	private constructor(VehicleDutyCode:string,VehicleLicense:string){
		this.VehicleDutyCode=VehicleDutyCode;
		this.VehicleLicense=VehicleLicense;
	}

    /**
     * Creates a VehicleDuty object
     * @param object Dto used to create the object
     */
	public static create(object : any){
		this.validate(object);
		return new VehicleDuty(object.code,object.vehicleLicense);
	}

	private static validate(object: VehicleDutyViewDTO) {
		
		//code validation
		if (object.code) {
			if (object.code.length != 10 ) {
				throw new Error('Code must be 10 characters long');
			}
		} else {
			throw new Error('Code is required');
		}

		//driver code validation
		if (!object.vehicleLicense) {
			
			throw new Error('Vehicle is required');
		}


	}


}