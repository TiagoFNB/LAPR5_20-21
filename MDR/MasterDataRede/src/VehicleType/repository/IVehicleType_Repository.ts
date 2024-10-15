import { BaseRepositoryInterface } from '../../Repositories/MongoDB_Repositories/Base_Repository/IBase_Repository';
export interface VehicleTypeRepositoryInterface extends BaseRepositoryInterface {
	exists(query: any);
	find();
	findByIdentity(id:any);
}
