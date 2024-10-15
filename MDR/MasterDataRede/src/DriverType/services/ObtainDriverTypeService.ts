import { Service, Inject } from 'typedi';
import { DriverType } from '../domain/DriverType';
import { DriverTypeDTOMapper } from '../mappers/DriverTypeDTOMapper';
import { DriverTypeRepositoryInterface } from '../repository/IDriverType_Repository';
import { ObtainDriverTypeServiceInterface } from './IObtainDriverTypeService';
import { ObtainDriverTypesServiceInterface } from './IObtainDriverTypesService';

@Service('DriverType.ObtainDriverTypeService')
export class ObtainDriverTypeService implements ObtainDriverTypeServiceInterface  {

    constructor(@Inject('DriverType.repository') private DriverTypeRepo: DriverTypeRepositoryInterface) {

    }

	async obtainDriverType(DriverTypeName : string): Promise<any> {
        let driverTypeDTO;
        //Obtain all driverTypes
       
        return await this.DriverTypeRepo.findByIdentity(DriverTypeName)
        .then(async (driverType) => {
            
            if(driverType == null){
                return Promise.resolve(undefined);
            }
               
            let v = DriverTypeDTOMapper.DriverTypeMapDTO2Domain(driverType);
                
            //Create the object
            let createdVT;
            await DriverType.create(v).then((vt) => {
                createdVT = vt;
            });
            
            driverTypeDTO=DriverTypeDTOMapper.DriverTypeMapDomain2Persistence(createdVT);
            
            return new Promise(function(resolve, reject) {
                return resolve(driverTypeDTO);
            });
          
          
        }).catch((err) => {
            
            return new Promise(function(resolve, reject) {
                return reject(err);
            });
        });

            

     
	}

}