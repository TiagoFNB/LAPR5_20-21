const joi = require('@hapi/joi');
import { ValueObject } from '../../utils/domain/ValueObject';
import { Node_ShortName } from './Node_ShortName';
interface Node_TypeProps {
	isDepot: boolean;
	isReliefPoint: boolean;
	crewTravelTimeDuration: number;
	crewTravelTimeReferenceNode?: Node_ShortName;
}

export class Node_Type extends ValueObject<Node_TypeProps> {
	private constructor(props: Node_TypeProps) {
		super(props);

		const validationResult = this.validate(
			props.isDepot,
			props.isReliefPoint,
			props.crewTravelTimeDuration,
			props.crewTravelTimeReferenceNode
		);
		if (validationResult.error) {
			throw new Error(validationResult.error);
		}
	}

	public static create(
		isDepot: boolean,
		isReliefPoint: boolean,
		crewTravelTimeDuration: number,
		crewTravelTimeReferenceNode?: string
	) {
		if (isDepot == true) {
			// if a node is depot then it is also a relief point even if it is not specified or passed as false from outside
			isReliefPoint = true;
		}

		let node;
		if (crewTravelTimeReferenceNode) {
			node = Node_ShortName.create(crewTravelTimeReferenceNode);
		}
		return new Node_Type({
			isDepot: isDepot,
			isReliefPoint: isReliefPoint,
			crewTravelTimeDuration: crewTravelTimeDuration,
			crewTravelTimeReferenceNode: node
		});
	}

	public validate(
		isDepot: boolean,
		isReliefPoint: boolean,
		crewTravelTimeDuration: number,
		crewTravelTimeReferenceNode: Node_ShortName
	) {
		if (
			(crewTravelTimeDuration && !crewTravelTimeReferenceNode) ||
			(!crewTravelTimeDuration && crewTravelTimeReferenceNode)
		) {
			if (isDepot == false && isReliefPoint == false) {
				throw new Error(
					'you are trying to specify a crew travel time duration or crew travel reference node  in a node that is not depot neither relief point'
				);
			}
			throw new Error(
				'you are trying to specify a crew travel time duration without a crew travel reference node  or vice versa'
			);
		}

		if (crewTravelTimeDuration || crewTravelTimeReferenceNode) {
			if (isReliefPoint == false && isDepot == false) {
				throw new Error(
					'you are trying to specify a crew travel time duration or a crew travel reference node  of a node that is not depot or relief point'
				);
			}

			const schema = {
				isDepot: joi.boolean().required(),
				isReliefPoint: joi.boolean().required()
			};
			return joi.validate({ isDepot, isReliefPoint }, schema);
		}
		if (!crewTravelTimeDuration) {
			const schema = {
				isDepot: joi.boolean().required(),
				isReliefPoint: joi.boolean().required()
			};
			return joi.validate({ isDepot, isReliefPoint }, schema);
		}
	}

	get isDepot(): boolean {
		return this.props.isDepot;
	}
	get isReliefPoint(): boolean {
		return this.props.isReliefPoint;
	}
	get crewTravelTimeDuration(): number {
		return this.props.crewTravelTimeDuration;
	}
	get crewTravelTimeReferenceNode(): Node_ShortName {
		return this.props.crewTravelTimeReferenceNode;
	}
}
