import Container, { Service, Inject } from 'typedi';
import { IDTO_Path } from '../interfaces/IDTO_Path';
import { Path } from '../domain/Path';
import { IPath_Repository } from '../repository/IPath_Repository';
import { IDTO_PathSegment } from '../interfaces/IDTO_PathSegment';
import { NodeRepositoryInterface } from '../../Node/repository/INode_Repository';
import { Path_DtoMapper } from '../mappers/Path_DtoMapper';
import { ILine_Repository } from '../../Line/repository/ILine_Repository';
import {IPath_CreateService} from '../interfaces/IPath_CreateService';
import { isThrowStatement, resolveProjectReferencePath } from 'typescript';

@Service('path.CreateService')
export class Path_CreateService implements IPath_CreateService{
	constructor(@Inject('Path_Repo') private pathRepo: IPath_Repository, @Inject('node.repository') private nodeRepo: NodeRepositoryInterface, @Inject('Line_Repo') private lineRepo: ILine_Repository) { }

	/**
	 * Validates the path and registers it in the database
	 * 
	 * In case an error occurs it is held inside the promise
	 * 
	 * @param pathDTO path DTO
	 * 
	 */

	public async registerPath(obj): Promise<any> {

		let object = await Path_DtoMapper.mapDTO2Domain(obj);

		await this.pathRepo.exists({'key':obj.key})
		.then(err =>{
			if(err){
				return new Promise(function(resolve, reject) {
					reject(new Error('Duplicated Path, key already in use :('));
			});
			}
		});
	


		//calls static method that verify and obtains line
		let line = await this.verifyLine(object.line);
		
		if(line instanceof Error || line == null){
			return new Promise(function(resolve, reject) {	
				// new Error("Line wasn't found");
				return reject(new Error("Line wasn't found"));
			});
		}

		//Verify if pathsegments are in correct order
		await this.verifyPathSegments(object.pathSegments, line);

		//this will only determinate if the list has only one pathsegment or less to fullfil requirement in "isEmpty"
		object.isEmpty = true;
		if (object.pathSegments.length > 1) {
			object.isEmpty = false;
		}


		//Initialize Path
		const path = await Path.create(object);

		const dto2persistence = await Path_DtoMapper.mapDomain2Persistence_Path(path);
		let savedpath = await this.pathRepo.create(dto2persistence);
		//console.log(savedpath);
		if(savedpath instanceof Error) {
			return new Promise(function(resolve, reject){
				reject(new Error('Couldnt save new path in DB'))
			});
		}else {
			//mapper domain to DTO
			let dtoPath = Path_DtoMapper.map2Dto_Path(savedpath.key,savedpath.line, savedpath.type,savedpath.pathSegments,savedpath.isEmpty);
			return new Promise(function(resolve, reject){
				resolve(dtoPath)
			});
		}

	}

	//function to verify each pathsegments is in the proper order
	async verifyPathSegments(array: IDTO_PathSegment[], line : any): Promise<any> {

		let auxNode = array[0].node1;

		for (let i = 0; i < array.length; i++) {

			//Verify if node[i].node1 exists
			let exist = await this.nodeRepo.exists({shortName: array[i].node1});
			if (typeof exist == "boolean") {  //IF it's a boolean it isn't an ERROR

				//------------verify if it's true that the node1 exists
				if (exist) {

					//Last Node not equals First from new Path Segment
					if (auxNode !== array[i].node1) {

						//Returns Error because it isnt sorted
						return new Promise(function (resolve, reject) {
							return reject(new Error('PathSegments not properly sorted'));
						});
					} else { //It's sorted

						auxNode = array[i].node2; //Now node2 will be the last one to compare with the first of the next path Segment
						exist = await this.nodeRepo.exists({shortName: auxNode});

						if (typeof exist == "boolean") {//Verify if result of exist is a boolean
							if (!exist) {//Verify if it isn't true

								return new Promise(function (resolve, reject) {
									return reject(new Error(auxNode + ' doesnt exist in the DB'));
								});

							}

						} else {
							return new Promise(function (resolve, reject) {
								return reject(new Error(auxNode + ' doesnt exist in the DB'));
							});
						}


					}


				} else {
					return new Promise(function (resolve, reject) {
						return reject(new Error(auxNode + ' doesnt exist in the DB'));
					});
				}
			} else { //1It was an ERROR and didn't exist
				return new Promise(function (resolve, reject) {
					return reject(new Error(auxNode + ' doesnt exist in the DB'));
				});
			}

		}



		let firstNode = array[0].node1;						//Pathsegments Begin Node
		let lastNode = array[array.length-1].node2;			//pathsegments End Node

		//Next we will test if the begin/end of the line is equal to firstNode and beginNode, because the start of line must be either the begin or end of the path

		if(firstNode === line.terminalNode1 && lastNode === line.terminalNode2 ){
			return Promise.resolve();
		} else {
			if(firstNode === line.terminalNode2 && lastNode === line.terminalNode1){
				return Promise.resolve();
			} else{
				return Promise.reject(new Error('TerminalNodes ('+line.terminalNode1+','+line.terminalNode2+') from Line ('+line.key+') are NOT EQUAL to 1st and Last Node of the Path : ('+firstNode+','+lastNode+')'));
			}
		}

	}

	//verify if line exists and returns it
	async verifyLine(lineId :string) : Promise<any>{
		let linha = await this.lineRepo.findByIdentity('key',lineId);
		return linha;
	}
}