import { BaseRepositoryInterface } from '../../Repositories/MongoDB_Repositories/Base_Repository/IBase_Repository';
export interface IPath_Repository extends BaseRepositoryInterface  {
    exists(query:any);
    findPathsOfLine(lineId: any);
    find();
}