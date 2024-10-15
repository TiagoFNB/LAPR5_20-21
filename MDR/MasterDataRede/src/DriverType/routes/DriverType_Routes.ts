import { Container } from 'typedi';
const Router = require('express');
import RegisterDriverTypeController from '../controller/RegisterDriverTypeController';
import ObtainDriverTypesController from '../controller/ObtainDriverTypesController';
import ObtainDriverTypeController from '../controller/ObtainDriverTypeController';

const route = Router();
const adminGuard = require('../../AuthGuard/AdminGuard');
const managerGuard = require('../../AuthGuard/ManagerGuard');
const userGuard = require('../../AuthGuard/UserGuard');
export default (app) => {
	const RegisterDriverTypeControllerInstance = new RegisterDriverTypeController(
		Container.get('DriverType.Registerservice')
	);
	const ObtainDriverTypesControllerInstance = new ObtainDriverTypesController(
		Container.get('DriverType.ObtainDriverTypesService')
	);

	const ObtainDriverTypeControllerInstance = new ObtainDriverTypeController(
		Container.get('DriverType.ObtainDriverTypeService')
	);

	//app.use('/api/drivertype', route);
	app.use('/api/drivertype', route);
	route.post('', adminGuard.isAdmin, async function(req, res) {
		RegisterDriverTypeControllerInstance.registerDriverType(req, res);
	});

	route.get('', userGuard.isUser, async function(req, res) {
		ObtainDriverTypesControllerInstance.obtainDriverTypes(req, res);
	});
	

	route.get('/:name', userGuard.isUser, async function(req, res) {
		ObtainDriverTypeControllerInstance.obtainDriverType(req, res);
	});
};
