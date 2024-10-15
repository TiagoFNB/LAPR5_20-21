const joi = require('@hapi/joi');
import { ValueObject } from "../../utils/domain/ValueObject";

interface LineRGBProps {
    red: Number;
    green: Number;
    blue: Number;
}

export class LineRGB extends ValueObject<LineRGBProps>{

    private constructor(props: LineRGBProps) {
        super(props);

        let err = this.validation(props.red,props.green,props.blue).error;

        if(err != null){
            throw err;
        }
        
    }

    private validation(red : Number, green : Number, blue : Number): any {
        const schema = { red: joi.number().min(0).max(255).required(),
                        green: joi.number().min(0).max(255).required(),
                        blue: joi.number().min(0).max(255).required()};

        return joi.validate({ red,green,blue }, schema);
    }

    get red(): Number {
        return this.props.red;
    }

    get green(): Number {
        return this.props.green;
    }

    get blue(): Number {
        return this.props.blue;
    }

    set red(red : Number){
        this.props.red = red;
    }

    set green(green : Number){
        this.props.green = green;
    }

    set blue(blue : Number){
        this.props.blue = blue;
    }

    /**
    * Creates a Line object, throws error if key is invalid to create LineCode
    * 
    * @param key Line code string
    */
    static create(red: Number, green : Number, blue : Number): LineRGB {
        return new LineRGB({ 
            red : red, 
            green : green, 
            blue : blue });
    }
}