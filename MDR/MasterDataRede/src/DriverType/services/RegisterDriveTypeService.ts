import { Service, Inject } from 'typedi';
import { DriverTypeRepositoryInterface } from '../repository/IDriverType_Repository'
import { DriverType } from '../domain/DriverType';
//const DriverType = require('../domain/DriverType');
import { IDriverTypeDTO } from '../interfaces/IDriverTypeDTO';
import { DriverTypeDTOMapper } from "../mappers/DriverTypeDTOMapper";
import { RegisterDriverTypeServiceInterface  } from "./IRegisterDriverTypeService"
import { DriverTypeInterface } from '../domain/IDriverType';
@Service('DriverType.Registerservice')
export class RegisterDriverTypeService implements RegisterDriverTypeServiceInterface  {




    constructor(@Inject('DriverType.repository') private driverTypeRepo: DriverTypeRepositoryInterface) {

    }


	async registerDriverType(object): Promise<any> {
		
		let createddt;
		let saveddt;
		//map object to domain and create it
		const dto2domain = DriverTypeDTOMapper.DriverTypeMapDTO2Domain(object);
		await DriverType.create(dto2domain)
			.then(async (dt) => {
				createddt = dt;
			
			})
			.catch(async (err) => {
				
				return new Promise(function(resolve, reject) {
					return reject(err);
				});
			});
		//map to persistence and repo.create it
		const dto = DriverTypeDTOMapper.DriverTypeMapDomain2Persistence(createddt);

		await this.driverTypeRepo
			.create(dto)
			.then((dt) => {
				saveddt = dt;
				
			})
			.catch((err) => {
				
				return new Promise(function(resolve, reject) {
					return reject(err);
				});
			});
		//map to presentation	
		return new Promise(function(resolve, reject) {
			const dto = DriverTypeDTOMapper.DriverTypeMapPersistence2DTO(
				saveddt.name,
				saveddt.description

			);
			//console.log(dto);
		
			return resolve(dto);
		});
	}




    
}

