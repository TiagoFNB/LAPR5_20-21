export interface IObtainNodeService {
	listNodesByShortNameOrName(query): Promise<any>;
}
