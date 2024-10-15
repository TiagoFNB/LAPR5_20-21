import { BaseRepositoryInterface } from '../../Repositories/MongoDB_Repositories/Base_Repository/IBase_Repository';
export interface ILine_Repository extends BaseRepositoryInterface  {
    findListOfLines(filter: string, typefilter: string, sort: string);
}