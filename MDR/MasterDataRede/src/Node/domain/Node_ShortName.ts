const joi = require('@hapi/joi');
import { ValueObject } from '../../utils/domain/ValueObject';

interface NodeShortNameProps {
	shortName: string;
}

export class Node_ShortName extends ValueObject<NodeShortNameProps> {
	private constructor(props: NodeShortNameProps) {
		super(props);
		const validationResult = this.validate(props.shortName);
		if (validationResult.error) {
			throw new Error(validationResult.error);
		}
	}

	public static create(shortName: string) {
		return new Node_ShortName({ shortName: shortName });
	}

	public validate(shortName: string) {
		const schema = {
			shortName: joi.string().min(2).max(25).required()
		};
		return joi.validate({ shortName }, schema);
	}

	get shortName(): string {
		return this.props.shortName;
	}
}
