const fs = require('fs');
const { DOMParser } = require('xmldom');
const xml2js = require('xml2js');

import { Service, Inject } from 'typedi';
import { IDTO_Node } from '../../Node/DTO/IDTO_Node';
import { RegisterNodeServiceInterface } from '../../Node/services/INodeRegisterService';
import { RegisterDriverTypeServiceInterface } from '../../DriverType/services/IRegisterDriverTypeService';
import { RegisterVehicleTypeServiceInterface } from '../../VehicleType/services/IVehicleTypeRegisterService';
import { IDriverTypeDTO } from '../../DriverType/interfaces/IDriverTypeDTO';
import { FileUploadServiceInterface } from './IFileUploadService';
import { ConsoleLogger } from '@node-ts/logger-core';
import { IDTO_PathSegment } from '../../Path/interfaces/IDTO_PathSegment';
import { ILine_CreateService } from '../../Line/services/ILine_CreateService';
import { IPath_CreateService } from '../../Path/interfaces/IPath_CreateService';
import { IDTO_Line } from '../../Line/interfaces/IDTO_Line';

@Service('FileUpload.service')
export class FileUploadService implements FileUploadServiceInterface {
	constructor(
		@Inject('node.Registerservice') private nodeRegisterServiceInstance: RegisterNodeServiceInterface,
		@Inject('DriverType.Registerservice')
		private registerDriverTypeServiceInstance: RegisterDriverTypeServiceInterface,
		@Inject('path.CreateService') private createPathServiceInstance: IPath_CreateService,
		@Inject('vehicleType.Registerservice')
		private registerVehicleTypeServiceInterface: RegisterVehicleTypeServiceInterface,
		@Inject('line.CreateService') private createLineService: ILine_CreateService
	) {}

	async fileUpload(xmlTemp): Promise<any> {
		let error_array: any[] = [];

		let document;
		let data;

		try {
			data = fs.readFileSync(xmlTemp, { encoding: 'utf8' });
		} catch (er) {
			error_array.push(er.message);
			return error_array;
		}

		let domParser = new DOMParser({
			errorHandler: {
				warning: (msg) => {},
				error: (msg) => {
					error_array.push(msg);
				},
				fatalError: (msg) => {
					error_array.push(msg);
				}
			}
		});

		document = domParser.parseFromString(data);
		if (error_array.length > 0) {
			error_array.splice(0, error_array.length);
			error_array[0] = 'FATAL ERROR: PLEASE UPLOAD A VALID XML OR GLX FILE';
		}

		let parser = new xml2js.Parser({
			attrkey: 'attr',
			explicitRoot: false,
			explicitArray: false,
			mergeAttrs: true,
			attrNameProcessors: [ xml2js.processors.firstCharLowerCase ],
			tagNameProcessors: [ xml2js.processors.firstCharLowerCase ]
		});

		let nodes = document.getElementsByTagName('Node');

		await this.loadNodes(nodes, parser).then((errors) => {
			error_array.push(...errors);
		});

		var driverTypes = document.getElementsByTagName('DriverType');

		await this.loadDriverTypes(driverTypes, parser).then((errors) => {
			error_array.push(...errors);
		});

		var vehicleTypes = document.getElementsByTagName('VehicleType');
		await this.loadVehicleTypes(vehicleTypes, parser).then((errors) => {
			error_array.push(...errors);
		});

		let paths = document.getElementsByTagName('Path');
		let lines = document.getElementsByTagName('Line');

		await this.loadPathsAndLines(paths, lines, nodes, parser)
			.then((errors) => {
				error_array.push(...errors);
			})
			.catch((er) => {
				console.log(er);
			});

		return error_array;
	}

	async loadDriverTypes(driverTypes, parser): Promise<any> {
		let driverTypeService = this.registerDriverTypeServiceInstance;
		var erro = [];
		var result;
		for (var _i = 0; _i < driverTypes.length; _i++) {
			result = await this.parseXml(driverTypes[_i], parser);
			// `result` is a JavaScript object
			await driverTypeService.registerDriverType(result as IDriverTypeDTO).catch((err) => {
				erro.push(err.message);
			});
		}
		return new Promise((resolve, reject) => {
			resolve(erro);
		});
	}

	async loadVehicleTypes(vehicleTypes, parser): Promise<any> {
		let vehicleTypesService = this.registerVehicleTypeServiceInterface;
		var erro = [];
		var result;
		for (var _i = 0; _i < vehicleTypes.length; _i++) {
			result = await this.parseXml(vehicleTypes[_i], parser);
			// `result` is a JavaScript object
			result.fuelType = result.energySource;
			result.costPerKm = result.cost;
			result.averageConsumption = result.consumption;
			delete result.energySource;
			delete result.cost;
			//console.log(result);
			await vehicleTypesService.registerVehicleType(result).catch((err) => {
				erro.push(err.message);
			});
		}
		return new Promise((resolve, reject) => {
			resolve(erro);
		});
	}

	async loadPathsAndLines(paths, lines, nodes, parser): Promise<any> {
		var erro = [];
		var pathSegments;
		var line;
		//for each line
		for (var _i = 0; _i < lines.length; _i++) {
			line = await this.parseXml(lines[_i], parser);
			await this.loadPathsAndLines2(paths, line, nodes, parser).then((err) => {
				erro.push(...err);
			});

			//console.log(line);
		}

		return new Promise((resolve, reject) => {
			resolve(erro);
		});
	}

	async loadPathsAndLines2(paths, line, nodes, parser): Promise<any> {
		let pathService = this.createPathServiceInstance;
		var erro = [];
		let lineService = this.createLineService;
		var linePath;
		var path;
		let biggerPathLength;
		// for each path in linePaths
		for (var _j = 0; _j < line.linePaths.linePath.length; _j++) {
			linePath = line.linePaths.linePath[_j];
			//find it in DB
			var path = await this.findPathInDocument(linePath, paths, parser);
			//if it is first loop then assign biggerPathLength to 0,so we can obtain the bigger path later
			if (_j == 0) {
				biggerPathLength = 0;
			}

			path.pathSegments = [];
			//form the path segments
			await this.arrangePathSegments(path, nodes, parser);
			//if current path is bigger than previous, update line terminal nodes and biggerpathlength
			if (path.pathSegments.length > biggerPathLength) {
				line.terminalNode1 = path.pathSegments[0].node1;
				line.terminalNode2 = path.pathSegments[path.pathSegments.length - 1].node2;
				biggerPathLength = path.pathSegments.length;
			}

			//again if it's first run, we need first to save the line in DB
			if (_j == 0) {
				//arranging line fields
				let str = line.color.substring(4, line.color.length - 1);
				let color = str.split(',');
				line.RGB = {
					red: color[0],
					green: color[1],
					blue: color[2]
				};

				line.key = line.key.substr(5, line.key.length);
				if (line.allowedVehicles == '') {
					line.AllowedVehicles = [];
				}
				if (line.allowedDrivers == '') {
					line.AllowedDrivers = [];
				}
				// console.log(line);
				//register the line
				await lineService.registerLine(line as IDTO_Line).catch((err) => {
					console.log(err);
					erro.push(err.message);
				});
			}
			path.key = path.key.substr(5, path.key.length);
			path.type = linePath.orientation;
			path.line = line.key;

			//regist the path
			await pathService.registerPath(path).catch((err) => {
				console.log(err);
				erro.push(err.message);
			});
		}

		return new Promise((resolve, reject) => {
			resolve(erro);
		});
	}

	//method that loads the nodes
	async loadNodes(nodes, parser): Promise<any> {
		let nodeService = this.nodeRegisterServiceInstance;
		var erro = [];
		var result;
		for (var _i = 0; _i < nodes.length; _i++) {
			result = await this.parseXml(nodes[_i], parser);
			// `result` is a JavaScript object

			//node has a crewTravelTimes field then we must arrange it to correct way
			if (result.crewTravelTimes.crewTravelTime) {
				if (result.key == result.crewTravelTimes.crewTravelTime.node) {
					result.crewTravelTimeReferenceNode = result.shortName;
				} else {
					result.crewTravelTimeReferenceNode = await this.findNodeInDocument(
						result.crewTravelTimes.crewTravelTime,
						nodes,
						parser
					);
				}
				result.crewTravelTimes = result.crewTravelTimes.crewTravelTime.duration;
			}

			//regist it through service
			await nodeService.registerNode(result as IDTO_Node).catch((err) => {
				erro.push(err.message);
			});
		}

		return new Promise((resolve, reject) => {
			resolve(erro);
		});
	}

	//method that parses the xml and returns js
	parseXml(xml, parser) {
		return new Promise((resolve, reject) => {
			parser.parseString(xml, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	}

	//method that forms the path segments that belong to a path
	async arrangePathSegments(path, nodes, parser): Promise<any> {
		for (var _i = 0; _i < path.pathNodes.pathNode.length - 1; _i++) {
			//find first node
			let shortName1 = await this.findNodeInDocument(path.pathNodes.pathNode[_i], nodes, parser);
			//find seconde node
			let shortName2 = await this.findNodeInDocument(path.pathNodes.pathNode[_i + 1], nodes, parser);
			//insert duration and distance of second pathNode
			var pathSegment: IDTO_PathSegment = {
				node1: shortName1,
				node2: shortName2,
				duration: path.pathNodes.pathNode[_i + 1].duration,
				distance: path.pathNodes.pathNode[_i + 1].distance
			};
			//push it to pathSegments of path
			path.pathSegments.push(pathSegment);
		}
		return new Promise((resolve, reject) => {
			resolve(undefined);
		});
	}

	//method that finds a specific node in document
	async findNodeInDocument(pathNode, nodes, parser): Promise<any> {
		var result;
		//console.log(nodes.length);
		for (var _i = 0; _i < nodes.length; _i++) {
			result = await this.parseXml(nodes[_i], parser);
			if (result.key == pathNode.node) {
				return new Promise((resolve, reject) => {
					resolve(result.shortName);
				});
			}
		}
		return new Promise((resolve, reject) => {
			resolve(undefined);
		});
	}

	//method that finds a specific path in document
	async findPathInDocument(linePath, paths, parser): Promise<any> {
		var result;
		for (var _i = 0; _i < paths.length; _i++) {
			result = await this.parseXml(paths[_i], parser);
			if (result.key == linePath.path) {
				return new Promise((resolve, reject) => {
					resolve(result);
				});
			}
		}
		return new Promise((resolve, reject) => {
			resolve(undefined);
		});
	}
}
