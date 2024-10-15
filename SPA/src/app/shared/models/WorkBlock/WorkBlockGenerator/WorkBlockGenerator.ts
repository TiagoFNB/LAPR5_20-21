import { WorkBlockGeneratorInterface } from './WorkBlockGeneratorInterface';

export class WorkBlockGenerator implements WorkBlockGeneratorInterface{
	public maxBlocks: number;
    public maxDuration : number;
    public dateTime : string;
    public vehicleDuty : string;
    public trips : string[];

	private constructor(maxBlocks: number,maxDuration: number,dateTime: string,vehicleDuty: string,trips: string[]){ 
        this.maxBlocks=maxBlocks;
        this.maxDuration=maxDuration;
        this.dateTime=dateTime;
        this.vehicleDuty=vehicleDuty;
        this.trips=trips;
	}

	public static create(object){
        this.validate(object);
        return new WorkBlockGenerator(object.maxBlocks,object.maxDuration,object.dateTime,object.vehicleDuty,object.trips);
	}

	private static validate(object: WorkBlockGeneratorInterface) {
		
		//maxBlocks validation
		if (!object.maxBlocks) {
			throw new Error('Number of Blocks is required.');
        }
        else if(object.maxBlocks<=0){
            throw new Error('Number of Blocks must be higher than 0.')
        }
        else if(!object.maxDuration){
            throw new Error('Block duration is required.')
        }
        else if(object.maxDuration<=0){
            throw new Error('Block duration must be higher than 0.')
        }
        else if(!object.dateTime){
            throw new Error('Generation Starting Time is required.')
        }
        else if(!object.vehicleDuty){
            throw new Error('Vehicle Duty is required.')
        }
        else if(!object.trips || object.trips.length==0){
            throw new Error('Trips are required.')
        }
	}


}