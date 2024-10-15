import { VehicleType } from './../VehicleType/domain/VehicleType';

import { Container } from 'typedi';

const NodeSchema = require('../Node/data_schema/Node_Schema');
Container.set({ id: 'Node_DataSchema', value: NodeSchema });

const LineSchema = require('../Line/data_schema/Line_Schema');
Container.set({ id: 'Line_Schema', value: LineSchema });

const DriverTypeSchema = require('../DriverType/data_schema/DriverType_Schema');

const { Node_Repository } = require('../Repositories/MongoDB_Repositories/Node_Repository/Node_Repository');
const { RegisterNodeService } = require('../Node/services/RegisterNodeService');
const { ObtainNodeService } = require('../Node/services/ObtainNodeService');
const { Line_CreateService } = require('../Line/services/Line_CreateService');
const { Line_Repository } = require('../Repositories/MongoDB_Repositories/Line_Repository/Line_Repository');

const PathSchema = require('../Path/data_schema/Path_schema');
const { Path_CreateService } = require('../Path/services/Path_CreateService');
const { Path_Repository } = require('../Repositories/MongoDB_Repositories/Path_Repository/Path_Repository');
Container.set({ id: 'Path_Schema', value: PathSchema });

Container.set({ id: 'DriverType_Schema', value: DriverTypeSchema });
const {
	DriverType_Repository
} = require('../Repositories/MongoDB_Repositories/DriverType_Repository/DriverType_Repository');
const { RegisterDriverTypeService } = require('../DriverType/services/RegisterDriveTypeService');

const { FileUploadService } = require('../FileUpload/services/FileUploadService');

// vehicle_type
const VehicleTypeSchema = require('../VehicleType/data_schema/VehicleType_Schema');
Container.set({ id: 'vehicleType_Schema', value: VehicleTypeSchema });
const {
	VehicleType_Repository
} = require('../Repositories/MongoDB_Repositories/VehicleType_Repository/VehicleType_Repository');
const { RegisterVehicleTypeService } = require('../VehicleType/services/RegisterVehicleTypeService');

// Get Paths Of Line
const { Line_GetPathsService } = require('../Line/services/Line_GetPathsService');

// Get List of Lines
const { Line_GetListService } = require('../Line/services/Line_GetListService');

// Get Driver Types
const {DriverType_ObtainDriverTypes} = require('../DriverType/services/ObtainDriverTypesService');

const {DriverType_ObtainDriverType} = require('../DriverType/services/ObtainDriverTypeService');

//Get Vehicle Types
const {VehicleType_ObtainDriverTypes} = require('../VehicleType/services/ObtainVehicleTypesService');

const {VehicleType_ObtainVehicleType} = require('../VehicleType/services/ObtainVehicleTypeService');

const {Path_GetListService} = require('../Path/services/Path_GetListService');

const {Line_GetByIdService} = require('../Line/services/Line_GetByIdService');

export default async () => {};
