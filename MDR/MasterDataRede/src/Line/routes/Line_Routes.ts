import { Container } from 'typedi';
const Router = require('express');
import { Line_Controller } from '../controller/Line_Controller';
import { Line_GetPathsController } from '../controller/Line_GetPathsController';
import { Line_GetListController } from '../controller/Line_GetListController';
import { Line_GetByIdController } from '../controller/Line_GetByIdController';
const route = Router();
const adminGuard = require('../../AuthGuard/AdminGuard');
const managerGuard = require('../../AuthGuard/ManagerGuard');
const userGuard = require('../../AuthGuard/UserGuard');
/*
* Routes for line operations
*/
export default (app) => {
	//Prefix definition
	app.use('/api/line', route);
	//app.use('/api/line', adminGuard.isAdmin, route);
	//Register a new line
	const lineContrInst = new Line_Controller(Container.get('line.CreateService'));
	route.post('', adminGuard.isAdmin, async function(req, res) {
		lineContrInst.registerLine(req, res);
	});

	const lineContrPathsInts = new Line_GetPathsController(Container.get('line.getPathsService'));
	//Obtains paths of a line
	route.get('/paths/:key', userGuard.isUser, async function(req, res) {
		lineContrPathsInts.getPaths(req, res);
	});

	const listLines = new Line_GetListController(Container.get('line.getListService'));
	//Obtains list of lines according to filter requested /list/:typefilter/:sort/:filter
	//127.0.0.1:3000/api/node/listByQuery?typeFilter=name&filter=n&sortBy=name
	route.get('/listByQuery', userGuard.isUser, async function(req, res) {
		listLines.getList(req, res);
	});

	const lineById = new Line_GetByIdController(Container.get('line.getByIdService'));
	//Obtains a single line
	route.get('/:key', userGuard.isUser, async function(req, res) {
		lineById.getLineById(req, res);
	});
};
