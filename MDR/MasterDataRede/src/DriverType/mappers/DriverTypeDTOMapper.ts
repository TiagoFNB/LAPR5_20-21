import { DriverType } from "../domain/DriverType";
import { IDriverTypeDTO } from "../interfaces/IDriverTypeDTO";

export class DriverTypeDTOMapper{

    static DriverTypeMap2DTO(name: string,description: string) : IDriverTypeDTO{
        const dto: IDriverTypeDTO = {

            name : name,
            description : description

        };

        return dto;
    }

    static DriverTypeMapDTO2Domain(dto) : IDriverTypeDTO{
        const toDomain: any = {
			name: dto.name,
			description: dto.description,
			key: dto.key,
			
			
		};

        return toDomain;
    }

    static DriverTypeMapPersistence2DTO(name: string,description: string) : IDriverTypeDTO{
        const dto: IDriverTypeDTO = {

            name : name,
            description : description

        };

        return dto;
    }

    static DriverTypeMapDomain2Persistence(dt: DriverType){
        const dto= {
            key : dt.key,
            name : dt.name.name,
            description : dt.description
            
        };

        return dto;
    }

}