import { IDTO_Line_Presentation } from "../interfaces/IDTO_Line_Presentation";
import { Line } from "../domain/Line";
import { Path_DtoMapper } from "../../Path/mappers/Path_DtoMapper";
import { IDTO_Line_Code } from "../interfaces/IDTO_Line_Code";

export class Line_DtoMapper {

    /**
     * Maps from object to Dto to send to the UI
     * 
     * @param key Line code
     * @param name Line name
     * @param terminalNode1 terminal Node 1
     * @param terminalNode2 terminal Node 2
     * @param RGB color
     */
    static map2Dto_Line_Presentation(key: string, name: string, terminalNode1: string, terminalNode2: string, RGB : any, allowedDrivers: string[], allowedVehicles:string[]): IDTO_Line_Presentation {
        const dto: IDTO_Line_Presentation = {

            key: key,
            name: name,
            terminalNode1: terminalNode1,
            terminalNode2: terminalNode2,
            RGB:{
                red:RGB.red,
                green:RGB.green,
                blue:RGB.blue
            },
            AllowedVehicles: allowedVehicles,
            AllowedDrivers: allowedDrivers
        };
        return dto;
    }

    /**
     * Maps the Line object to a persistence object
     * 
     * @param line Line object
     */
    static mapDomain2Persistence(line: Line) {
        const dto = {
            key: line.code.code,
            name: line.name.name,
            terminalNode1: line.terminalNode1.shortName,
            terminalNode2: line.terminalNode2.shortName,
            RGB: {
                red: line.RGB.red,
                green: line.RGB.green,
                blue: line.RGB.blue
            },
            allowedDrivers: line.allowedDrivers.map(function (type) {
                return type.name;
            }),
            allowedVehicles: line.allowedVehicles.map(function (type) {
                return type.name;
            }),
        };
        return dto;
    }


    /**
     * Creates a dto for a list of paths belonging to a list
     * 
     * @param code line id
     * @param list list of paths
     */
    static map2Dto_Line_Paths(code: string, list: any) {
        let pathsList = list.map(function (path) {
            return Path_DtoMapper.mapPersistence2Presentation(path.key, path.type, path.pathSegments, path.isEmpty);
        })

        const dto = {
            key: code,
            paths: pathsList
        };
        return dto;
    }

    /**
     * Creates a dto for a list of lines belonging to a list
     * 
     * @param code line id
     * @param list list of paths
     */
    static map2Dto_List_Lines(list: any) {

        let listLines = list.map(function (line) {

            let obj = line.allowedDrivers;
            let obj2 = line.allowedVehicles;

            if(line.RGB){
            return {
                key: line.key,
                name: line.name,
                terminalNode1: line.terminalNode1,
                terminalNode2: line.terminalNode2,

                RGB: {
                    red: line.RGB.red,
                    green: line.RGB.green,
                    blue: line.RGB.blue
                },

                AllowedVehicles: line.allowedVehicles,

                AllowedDrivers: line.allowedDrivers
                

            };
            }else{
                return {
                    key: line.key,
                    name: line.name,
                    terminalNode1: line.terminalNode1,
                    terminalNode2: line.terminalNode2,
                    AllowedVehicles: line.AllowedVehicles,
                    AllowedDrivers: line.AlloweDrivers
    
                };
            }
        });

        return listLines;
    }
    /*
     * Creates a dto for a line code
     * 
     * @param code line id
     */
    static map2DTO_Line_Code(code: string) {
        const dto: IDTO_Line_Code = {
            key: code,
        };
        return dto;
    }

}