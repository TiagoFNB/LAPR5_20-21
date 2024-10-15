export interface LineInterface {
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
}