import { BaseRepositoryInterface } from '../../Repositories/MongoDB_Repositories/Base_Repository/IBase_Repository';
export interface DriverTypeRepositoryInterface extends BaseRepositoryInterface  {
   find();
   findByIdentity(id:any);
  }