import {IPathSegment} from './IPathSegment';
import {PathSegment} from '../domain/PathSegment';
import { IDTO_PathSegment } from './IDTO_PathSegment';
import {PathType} from './PathType';
export interface IDTO_Path {
    key: string;
    line: string;
    type: PathType;
    pathSegments: IDTO_PathSegment[];
    isEmpty : boolean
  }