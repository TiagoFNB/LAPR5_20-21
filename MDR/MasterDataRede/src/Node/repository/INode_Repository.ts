import { BaseRepositoryInterface } from '../../Repositories/MongoDB_Repositories/Base_Repository/IBase_Repository';
export interface NodeRepositoryInterface extends BaseRepositoryInterface {
	exists(query: any);
	findWithfilter_AndOr_Sort(filterby, filtertype, sortby);
}
