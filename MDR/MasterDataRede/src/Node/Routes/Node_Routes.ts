import { Container } from 'typedi';
const Router = require('express');
import NodeRegisterController from '../controller/RegisterNodeController';
import ObtainNodeListByQueryController from '../controller/ObtainNodeListByQueryController';
const adminGuard = require('../../AuthGuard/AdminGuard');
const managerGuard = require('../../AuthGuard/ManagerGuard');
const userGuard = require('../../AuthGuard/UserGuard');
const route = Router();

export default (app) => {
	//console.log( NodeController.registerNode());

	const NodeControllerInstance = new NodeRegisterController(Container.get('node.Registerservice'));

	app.use('/api/node', route);

	route.post('', adminGuard.isAdmin, async function(req, res) {
		NodeControllerInstance.registerNode(req, res);
	});

	const obtainNodeListByQueryController = new ObtainNodeListByQueryController(
		Container.get('node.ObtainNodeService')
	);

	route.get('/listByQuery', userGuard.isUser, async function(req, res) {
		obtainNodeListByQueryController.listNodesByShortNameOrName(req, res);
	});
};
