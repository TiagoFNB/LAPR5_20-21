import { DriverDutyViewDTO } from '../../dtos/DriverDuty/DriverDutyViewDTO';
import { DriverDutyInterface } from './DriverDutyInterface';

export class DriverDuty{
	DriverDutyCode: string;
	DriverMecNumber: string;

	private constructor(DriverDutyCode:string,DriverMecNumber:string){
		this.DriverDutyCode=DriverDutyCode;
		this.DriverMecNumber=DriverMecNumber;
	}

    /**
     * Creates a DriverDuty object
     * @param object Dto used to create the object
     */
	public static create(object : DriverDutyViewDTO){
		this.validate(object);
		return new DriverDuty(object.code,object.driverCode);
	}

	private static validate(object: DriverDutyViewDTO) {
		
		//code validation
		if (object.code) {
			if (object.code.length != 10 ) {
				throw new Error('Code does not have correct length. (should be 10 characters long)');
			}
		} else {
			throw new Error('Code is required');
		}

		//driver code validation
		if (object.driverCode) {
			if (object.driverCode.length != 9 ) {
				throw new Error('Code does not have correct length. (should be 10 characters long)');
			}
		} else {
			throw new Error('Driver is required');
		}


	}


}


