import { IDTO_Line } from '../interfaces/IDTO_Line';

export interface ILine_CreateService   {
    registerLine(object : IDTO_Line):Promise<any>;
  }