import {PathSegmentInterface} from './PathSegment/PathSegmentInterface';
export interface PathInterface {
    key: string;
    line: string;
    type: string;
    pathSegments: PathSegmentInterface[];
    isEmpty : boolean
  }