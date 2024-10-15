import { Service, Inject } from 'typedi';
import { VehicleType } from '../domain/VehicleType';
import { VehicleType_Mapper } from '../mappers/VehicleTypeMap';
import { VehicleTypeRepositoryInterface } from '../repository/IVehicleType_Repository';
import { ObtainVehicleTypesServiceInterface } from './IObtainVehicleTypesService';

@Service('VehicleType.ObtainVehicleTypesService')
export class ObtainVehicleTypesService implements ObtainVehicleTypesServiceInterface  {

    constructor(@Inject('vehicleType.repository') private vehicleTypeRepo: VehicleTypeRepositoryInterface) {

    }

	async obtainVehicleTypes(): Promise<any> {
        let vehicleTypesDTOList;
        //Obtain all driverTypes
        await this.vehicleTypeRepo.find()
        .then((vehicleTypeList) => {
            vehicleTypeList.map(async function(element){
                //Map 2 domain object ready dto
                let driverType = VehicleType_Mapper.mapDTO2Domain(element);
                
                //Create the object
                let createdVT
                await VehicleType.create(driverType).then((vt) => {
                    createdVT = vt;
                });

                //Now map it to presentation and return
                return VehicleType_Mapper.map2DTO(createdVT);
            })
            vehicleTypesDTOList =vehicleTypeList;
        });
   
        //Return result
        return Promise.resolve(vehicleTypesDTOList);
	}

}
