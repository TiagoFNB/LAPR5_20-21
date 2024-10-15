import { Service, Inject } from 'typedi';
import { DriverTypeDTOMapper } from '../mappers/DriverTypeDTOMapper';
import { DriverTypeRepositoryInterface } from '../repository/IDriverType_Repository'
import { ObtainDriverTypesServiceInterface } from './IObtainDriverTypesService';

@Service('DriverType.ObtainDriverTypesService')
export class ObtainDriverTypesService implements ObtainDriverTypesServiceInterface  {

    constructor(@Inject('DriverType.repository') private driverTypeRepo: DriverTypeRepositoryInterface) {

    }

	async obtainDriverTypes(): Promise<any> {
        let driverTypesDTOList;
        //Obtain all driverTypes
        await this.driverTypeRepo.find()
        .then((driverTypeList) => {
            driverTypeList.map(function(element){
                let driverType = DriverTypeDTOMapper.DriverTypeMap2DTO(element.name,element.description);
                
                return driverType;
            })
            driverTypesDTOList =driverTypeList;
        });

        
        //Return result
        return Promise.resolve(driverTypesDTOList);

	}




    
}

