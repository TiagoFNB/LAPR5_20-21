export interface WorkBlockFromMDVDTO {
    Code: string;
	EndTime: number;
    StartTime : number,
    DriverDutyCode ?: string,
    VehicleDutyCode : string,
    trips : string[]
}