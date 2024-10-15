import { Service, Inject } from 'typedi';
import { IDTO_Line } from '../interfaces/IDTO_Line';
import { IDTO_Line_Presentation } from '../interfaces/IDTO_Line_Presentation';
import { Line } from '../domain/Line';
import { Line_DtoMapper } from '../mappers/Line_DtoMapper';
import { ILine_Repository } from '../repository/ILine_Repository';
import { NodeRepositoryInterface} from '../../Node/repository/INode_Repository';
import { DriverTypeRepositoryInterface} from '../../DriverType/repository/IDriverType_Repository';
import { ILine_CreateService } from './ILine_CreateService';
import { VehicleTypeRepositoryInterface } from '../../VehicleType/repository/IVehicleType_Repository';

@Service('line.CreateService')
export class Line_CreateService implements ILine_CreateService {
	constructor(@Inject('Line_Repo') private lineRepo: ILine_Repository,
	 @Inject('node.repository') private nodeRepo: NodeRepositoryInterface,
	  @Inject('DriverType.repository') private driverTypeRepo: DriverTypeRepositoryInterface,
	  @Inject('vehicleType.repository') private vehicleTypeRepo : VehicleTypeRepositoryInterface) { }

	/**
	 * Validates the line and registers it in the database
	 * 
	 * In case an error occurs it is held inside the promise
	 * 
	 * @param lineDTO Line DTO
	 * 
	 */
	public async registerLine(lineDTO: IDTO_Line): Promise<any> {
		let line : Line;
		let dto : IDTO_Line_Presentation;

		//Create the line from the dto
		await Line.create(lineDTO)
			.then(l => {
				line = l;
			})
			.catch((err) => {
				//Error ocurred, return it
				return Promise.reject(err);
			});

		
		//Make database verifications
		await this.verifyDatabaseElements(line);

		//---------------------
		//Go to the repo and create a new line
		await this.lineRepo.create(Line_DtoMapper.mapDomain2Persistence(line))
			.then(l => {
				//Map to dto and send to controller using resolve()
				dto = Line_DtoMapper.map2Dto_Line_Presentation(l.key, l.name, 
					l.terminalNode1, l.terminalNode2, l.RGB,l.allowedDrivers,l.allowedVehicles)
			})
			.catch((err) => {
				//Error ocurred, return it
				return Promise.reject(err);
		});

		return Promise.resolve(dto);
	}


	private async verifyDatabaseElements(line : Line) : Promise<any>{
		//Check if terminal node 1 exists
		let exist = await this.nodeRepo.exists({shortName:line.terminalNode1.shortName});

		if( typeof exist == "boolean"){
			if(!exist){
				return Promise.reject(this.noTerminalNodeError(line.terminalNode1.shortName));
			}
		}

		//Check if terminal node 2 exists
		exist = await this.nodeRepo.exists({shortName:line.terminalNode2.shortName});

		if( typeof exist == "boolean"){
			if(!exist){
				return Promise.reject(this.noTerminalNodeError(line.terminalNode2.shortName));
			}
		}

		// Check if the drivers in the list exist
		await this.driverTypeRepo.findListObjects("name",
		line.allowedDrivers.map(function(type){return type.name;}))
		.then(dbResult => {
			if((dbResult as any[]).length!=line.allowedDrivers.length){
				return Promise.reject(this.invalidDriver());
			}
		})
		
		//Check if the vehicles in the list exist
		await this.vehicleTypeRepo.findListObjects("name",
		line.allowedVehicles.map(function(type){return type.name;}))
		.then(dbResult => {
			if((dbResult as any[]).length!=line.allowedVehicles.length){
				return Promise.reject(this.invalidVehicle());
			}
		})

		return Promise.resolve(true);
	}

	/**
	 * Creates an error for the terminal node that does not exist
	 * 
	 * @param terminalNode 
	 */
	private noTerminalNodeError(terminalNode:string) : Error{
		let err = new Error();
		err.name = "NoMatchingNode";
		err.message ="Terminal Node: " + terminalNode + " does not exist.";
		return err;
	}

	/**
	 * Creates an error for invalid driver types
	 */
	private invalidDriver() : Error{
		let err = new Error();
		err.name = "InvalidDriverType";
		err.message = "At least one of the driver types in the list is invalid.";
		return err;
	}

	/**
	 * Creates an error for invalid driver types
	 */
	private invalidVehicle() : Error{
		let err = new Error();
		err.name = "InvalidVehicleType";
		err.message = "At least one of the vehicle types in the list is invalid.";
		return err;
	}

}


