export interface PathViewDTO {
	key: string;
	line: string;
	type: string;
    pathSegments: {
        node1: string,
        node2: string,
        duration: Number,
        distance: Number
    }[]
}