import { TripInterface } from "../TripInterface"

export class RegisterTripDto implements TripInterface{
    PathId: string
    LineId: string
    StartingTime: number
    EndTime?: number
    Frequency?: number
};