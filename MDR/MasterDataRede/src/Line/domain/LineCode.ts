const joi = require('@hapi/joi');
import { ValueObject } from "../../utils/domain/ValueObject";

interface LineCodeProps {
    code: string;
}

export class LineCode extends ValueObject<LineCodeProps>{

    get code(): string {
        return this.props.code;
    }

    private constructor(props: LineCodeProps) {
        super(props);
        let err = this.validation(props.code).error;

        if(err != null){
            throw err;
        }
    }

    private validation(code: string): any {
        const schema = { code: joi.string().alphanum().min(1).required() };

        return joi.validate({ code }, schema);
    }

    /**
    * Creates a LineCode object, throws error if key is invalid to create LineCode
    * 
    * @param key Line code string
    */
    static create(key: string): LineCode {
        return new LineCode({ code: key });
    }
}