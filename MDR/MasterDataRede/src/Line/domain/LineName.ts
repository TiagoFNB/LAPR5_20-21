const joi = require('@hapi/joi');
import { ValueObject } from "../../utils/domain/ValueObject";

interface LineNameProps {
    name: string;
}

export class LineName extends ValueObject<LineNameProps>{

    get name(): string {
        return this.props.name;
    }

    private constructor(props: LineNameProps) {
        super(props);

        let err = this.validation(props.name).error;

        if(err != null){
            throw err;
        }
    }

    private validation(name: string): any {
        const schema = { name: joi.string().min(1).required() };
        
        return joi.validate({ name }, schema);
    }

    /**
    * Creates a LineName object, throws error if key is invalid to create LineName
    * 
    * @param key Line code string
    */
    static create(key: string): LineName {
        return new LineName({ name: key });
    }
}