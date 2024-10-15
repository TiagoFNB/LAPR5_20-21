export interface IDTO_Node {
	key?: string;
	name: string;

	latitude: number;
	longitude: number;

	shortName: string;
	isDepot?: string;
	isReliefPoint?: string;
	crewTravelTimes?: number;
	crewTravelTimeReferenceNode?: string;
}
