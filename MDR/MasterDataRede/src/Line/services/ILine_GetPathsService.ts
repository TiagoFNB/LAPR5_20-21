import { IDTO_Line_Code } from '../interfaces/IDTO_Line_Code';

export interface ILine_GetPathsService  {
    getPathsService(object : IDTO_Line_Code):Promise<any>;
  }