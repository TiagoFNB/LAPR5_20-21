import {IPath} from '../interfaces/IPath';
import {IDTO_Path} from '../interfaces/IDTO_Path';
import {PathSegment} from './PathSegment';
import {IPathSegment} from '../interfaces/IPathSegment';
import {PathType} from '../interfaces/PathType';
import {PathKey} from '../domain/PathKey';
import { LineCode } from '../../Line/domain/LineCode';
import Model = require('mongoose');
const joi = require('@hapi/joi');

export class Path implements IPath{

    private _key : PathKey;

    private _line: LineCode;

    private _type : PathType;

    private _pathSegments : PathSegment[];

    private _isEmpty : boolean;

    /*

    Remember to add path lists here

    */

    constructor(key : string, line: string, type:PathType, PathSegments : PathSegment[], isEmpty : boolean){

        this.validation(type, PathSegments, isEmpty);


        //Value initializations
        this._key = PathKey.create(key);
        this._line = LineCode.create(line);
        this._type = type;
        this._pathSegments = PathSegments;
        this._isEmpty = isEmpty;

    }

    private validation(type: PathType, pathSegments: IPathSegment[], isEmpty: Boolean) {

        const schema = {
            type: joi.string().required(),
            pathSegments: joi.required(),
            isEmpty: joi.boolean().required(),
        };

        return joi.validate({type,pathSegments,isEmpty},schema);
    }

    /**
     * Creates a Promise holding line from it's corresponding DTO or an error
     * 
     * @param pathDTO Path DTO 
     */
    static async create(pathDTO : IDTO_Path) : Promise<any> {

        const pathSegArray = await PathSegment.create(pathDTO.pathSegments);

        return new Promise(function(resolve, reject) {
            try{
                const path = new Path(pathDTO.key,pathDTO.line,pathDTO.type,pathSegArray,pathDTO.isEmpty);
                resolve(path);
            }catch(e){
                reject(new Error('Error creating Path.'));
            }
          });
    }

    public get key() {
        return this._key;
    }

    public get line() {
        return this._line;
    }

    public get type() {
        return this._type;
    }

    public get pathSegments() {
        return this._pathSegments;
    }

    public get isEmpty() {
        return this._isEmpty;
    }
}