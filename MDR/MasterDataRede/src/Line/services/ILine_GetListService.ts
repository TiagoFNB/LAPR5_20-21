import { IDTO_List_Lines } from '../interfaces/IDTO_List_Lines';

export interface ILine_GetListService  {
    getList(object : IDTO_List_Lines):Promise<any>;
  }