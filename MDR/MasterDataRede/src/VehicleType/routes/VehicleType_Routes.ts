import { Container } from 'typedi';
const Router = require('express');
import VehicleTypeRegisterController from '../controller/RegisterVehicleTypeController';
import ObtainVehicleTypesController from '../controller/ObtainVehicleTypesController';
import ObtainVehicleTypeController from '../controller/ObtainVehicleTypeController';
const adminGuard = require('../../AuthGuard/AdminGuard');
const managerGuard = require('../../AuthGuard/ManagerGuard');
const userGuard = require('../../AuthGuard/UserGuard');
const route = Router();

export default (app) => {
	const vehicleTypeControllerInstance = new VehicleTypeRegisterController(
		Container.get('vehicleType.Registerservice')
	);
	const ObtainVehicleTypesControllerInstance = new ObtainVehicleTypesController(
		Container.get('VehicleType.ObtainVehicleTypesService')
	);

	const ObtainVehicleTypeControllerInstance = new ObtainVehicleTypeController(
		Container.get('VehicleType.ObtainVehicleTypeService')
	);

	app.use('/api/vehicleType', route);

	route.post('', adminGuard.isAdmin, async function(req, res) {
		vehicleTypeControllerInstance.registerVehicleType(req, res);
	});

	route.get('', userGuard.isUser, async function(req, res) {
		ObtainVehicleTypesControllerInstance.obtainVehicleTypes(req, res);
	});

	route.get('/:name', userGuard.isUser, async function(req, res) {
		ObtainVehicleTypeControllerInstance.obtainVehicleType(req, res);
	});
};
