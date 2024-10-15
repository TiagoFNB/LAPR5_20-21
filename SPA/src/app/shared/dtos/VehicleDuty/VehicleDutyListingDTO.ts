import { WorkBlockFromMDVDTO } from './../WorkBlock/WorkBlockFromMDVDTO';
export interface VehicleDutyListingDTO {
	vehicleDutyCode: string;
    vehicleLicense?: string;
    workblocks?: any[];
    date?:string;
    
}