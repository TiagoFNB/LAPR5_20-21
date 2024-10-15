import { IDTO_Path } from '../interfaces/IDTO_Path';

export interface IPath_CreateService   {
    registerPath(object : IDTO_Path):Promise<any>;
  }