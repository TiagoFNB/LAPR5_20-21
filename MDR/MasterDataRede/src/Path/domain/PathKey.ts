const joi = require('@hapi/joi');
import { ValueObject } from "../../utils/domain/ValueObject";

interface PathKeyProps {
    key: string;
}

export class PathKey extends ValueObject<PathKeyProps>{

    get key(): string {
        return this.props.key;
    }

    private constructor(props: PathKeyProps) {
        super(props);

        let err = this.validation(props.key).error;

        if(err != null){
            throw err;
        }
    }

    private validation(key: string): any {
        const schema = { key: joi.string().alphanum().min(1).required() };

        return joi.validate({ key }, schema);
    }

    /**
    * Creates a PathKey object, throws error if key is invalid to create PathKey
    * 
    * @param newkey Line code string
    */
    static create(newkey: string): PathKey {
        return new PathKey({ key: newkey });
    }
}