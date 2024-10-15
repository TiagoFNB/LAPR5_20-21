import { Service, Inject } from 'typedi';
import { VehicleType } from '../domain/VehicleType';
import { VehicleType_Mapper } from '../mappers/VehicleTypeMap';
import { VehicleTypeRepositoryInterface } from '../repository/IVehicleType_Repository';
import { ObtainVehicleTypeServiceInterface } from './IObtainVehicleTypeService';
import { ObtainVehicleTypesServiceInterface } from './IObtainVehicleTypesService';

@Service('VehicleType.ObtainVehicleTypeService')
export class ObtainVehicleTypeService implements ObtainVehicleTypeServiceInterface  {

    constructor(@Inject('vehicleType.repository') private vehicleTypeRepo: VehicleTypeRepositoryInterface) {

    }

	async obtainVehicleType(vehicleTypeName : string): Promise<any> {
        let vehicleTypeDTO;
        //Obtain A vehicleType
       
        return await this.vehicleTypeRepo.findByIdentity(vehicleTypeName)
        .then(async (vehicleType) => {
            
            if(vehicleType == null){
                return Promise.resolve(undefined);
            }
               
            let v = VehicleType_Mapper.mapDTO2Domain(vehicleType);
                
            //Create the object
            let createdVT;
            await VehicleType.create(v).then((vt) => {
                createdVT = vt;
            });
            vehicleTypeDTO=VehicleType_Mapper.map2DTO(createdVT);
            //Now map it to presentation and return
            return new Promise(function(resolve, reject) {
                return resolve(vehicleTypeDTO);
            });
          
          
        }).catch((err) => {
            
            return new Promise(function(resolve, reject) {
                return reject(err);
            });
        });

            

     
	}

}