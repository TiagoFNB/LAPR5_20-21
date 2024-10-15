import { IPathSegment } from '../interfaces/IPathSegment';
import { IDTO_PathSegment } from '../interfaces/IDTO_PathSegment';
import { ValueObject } from "../../utils/domain/ValueObject";
import { Node_ShortName } from '../../Node/domain/Node_ShortName';
const joi = require('@hapi/joi');

// interface PathSegmentProps {
//     node1: string;
//     node2: string;
//     duration: Number;
//     distance: Number;
// }

export class PathSegment implements IPathSegment {

    private _node1 : Node_ShortName;

    private _node2 : Node_ShortName;

    private _duration : Number;

    private _distance : Number;


    constructor(node1 : string, node2 : string, duration : Number, distance : Number){

        this.validation(duration,distance);

        //Value initializations
        this._node1 = Node_ShortName.create(node1);
        this._node2 = Node_ShortName.create(node2);
        this._duration = duration;
        this._distance = distance;

    }

    // private constructor(props: PathSegmentProps) {
    //     super(props);
    //     this.validation(props.node1, props.node2, props.duration, props.distance);
    // }

    private validation(duration: Number, distance: Number) {

        const schema = {
            duration: joi.number().strict().required(),
            distance: joi.number().strict().required(),
        };

        return joi.validate({duration, distance}, schema);
    }

    /**
     * Creates a Promise holding line from it's corresponding DTO or an error
     * 
     * @param object Pathseg DTO 
     tirou se async*/
    static async create(object : IDTO_PathSegment[]) : Promise<PathSegment[]>{

        return new Promise(function(resolve, reject) {

            try{
                let newArray = [];
                for(let i=0; i< object.length ; i++){
                    let pathSeg = new PathSegment(object[i].node1, object[i].node2, object[i].duration,object[i].distance);

                    newArray.push(pathSeg);

                }

               resolve(newArray);
            }catch(e){
                reject(e);
            }
          });
    }


    public get node1() {
        return this._node1;
    }

    public get node2() {
        return this._node2;
    }

    public get duration() {
        return this._duration;
    }

    public get distance() {
        return this._distance;
    }

}