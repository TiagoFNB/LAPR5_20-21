import { ValueObject } from "../../utils/domain/ValueObject";

const joi = require('@hapi/joi');
const Model = require('mongoose');

interface DriverTypeNameProps{
    name: string;
}

export class DriverTypeName extends ValueObject<DriverTypeNameProps> {

    get name(): string{
        return this.props.name;
    }

    private constructor(props : DriverTypeNameProps) {
        super(props);
        const validationResult = this.validation(props.name);
        if (validationResult.error)
            throw new Error(validationResult.error);
        
    }


    public static create(name2: string): DriverTypeName {
        
        return new DriverTypeName({name: name2});
    }


    validation(name: string) {
        const schema = {
            name: joi.string().required().min(1).max(20)
        };
        return joi.validate({ name }, schema);
    }





}