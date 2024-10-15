export interface IDTO_Line {
  key: string;
  name: string;
  terminalNode1: string;
  terminalNode2: string;
  RGB?: {
    red : Number,
    green : Number,
    blue : Number
  };
  AllowedVehicles: string[];
  AllowedDrivers: string[];
}