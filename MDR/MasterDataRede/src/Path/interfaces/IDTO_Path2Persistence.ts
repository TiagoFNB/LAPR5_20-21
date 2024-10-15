import { PathType } from "./PathType";

export interface IDTO_Path2Persistence {
	key: string;
	line: string;
	type: PathType;
	pathSegments:[
		{PathSegment:{
			node1:string,
			node2:string,
			duration: Number,
			distance: Number
		}},
	],
	isEmpty: boolean;
}
